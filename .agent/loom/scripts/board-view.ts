#!/usr/bin/env bun
/**
 * Loom Board View Generator
 *
 * Dynamically generates Kanban board view from feature-based structure.
 * No need to maintain board.json - this generates views on demand.
 *
 * Usage:
 *   bun .agent/loom/scripts/board-view.ts
 *   bun .agent/loom/scripts/board-view.ts --feature metrics-dashboard
 *   bun .agent/loom/scripts/board-view.ts --json
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface Story {
  id: string;
  title: string;
  status: string;
  priority: string;
  estimatedComplexity: string;
  tasks: any[];
  acceptanceCriteria: any[];
}

interface Feature {
  name: string;
  epic: string;
  status: string;
  stories: StoryCard[];
}

interface StoryCard {
  id: string;
  title: string;
  status: string;
  priority: string;
  feature: string;
  tasks: { total: number; completed: number };
  ac: { total: number; passed: number };
}

interface BoardView {
  columns: {
    backlog: StoryCard[];
    planned: StoryCard[];
    active: StoryCard[];
    done: StoryCard[];
  };
  features: Feature[];
  stats: {
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  };
}

// ============================================================================
// Scanning
// ============================================================================

function scanFeatures(featuresDir: string): Feature[] {
  if (!existsSync(featuresDir)) {
    return [];
  }

  const features: Feature[] = [];
  const featureDirs = readdirSync(featuresDir);

  for (const featureDir of featureDirs) {
    const manifestPath = join(featuresDir, featureDir, 'manifest.json');
    if (!existsSync(manifestPath)) continue;

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    const storiesDir = join(featuresDir, featureDir, 'stories');

    const stories: StoryCard[] = [];

    if (existsSync(storiesDir)) {
      const storyDirs = readdirSync(storiesDir);

      for (const storyDir of storyDirs) {
        const storyPath = join(storiesDir, storyDir, 'story.json');
        if (!existsSync(storyPath)) continue;

        const story: Story = JSON.parse(readFileSync(storyPath, 'utf-8'));

        const completedTasks = story.tasks.filter(t => t.status === 'completed').length;
        const passedAC = story.acceptanceCriteria.filter(ac => ac.status === 'pass').length;

        stories.push({
          id: story.id,
          title: story.title,
          status: story.status,
          priority: story.priority,
          feature: manifest.feature,
          tasks: {
            total: story.tasks.length,
            completed: completedTasks
          },
          ac: {
            total: story.acceptanceCriteria.length,
            passed: passedAC
          }
        });
      }
    }

    features.push({
      name: manifest.feature,
      epic: manifest.epic,
      status: manifest.status,
      stories
    });
  }

  return features;
}

// ============================================================================
// Board Generation
// ============================================================================

function generateBoardView(features: Feature[]): BoardView {
  const board: BoardView = {
    columns: {
      backlog: [],
      planned: [],
      active: [],
      done: []
    },
    features: features,
    stats: {
      total: 0,
      byStatus: {},
      byPriority: {}
    }
  };

  for (const feature of features) {
    for (const story of feature.stories) {
      // Map status to column
      let column: keyof typeof board.columns;
      switch (story.status) {
        case 'idea':
        case 'backlog':
          column = 'backlog';
          break;
        case 'planned':
        case 'ready':
          column = 'planned';
          break;
        case 'in-progress':
        case 'active':
          column = 'active';
          break;
        case 'done':
        case 'complete':
          column = 'done';
          break;
        default:
          column = 'backlog';
      }

      board.columns[column].push(story);

      // Stats
      board.stats.total++;
      board.stats.byStatus[story.status] = (board.stats.byStatus[story.status] || 0) + 1;
      board.stats.byPriority[story.priority] = (board.stats.byPriority[story.priority] || 0) + 1;
    }
  }

  return board;
}

// ============================================================================
// Visualization
// ============================================================================

function visualizeBoard(board: BoardView): void {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║ 📊 LOOM BOARD                                                 ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log('');

  // Header
  console.log('┌───────────────┬───────────────┬───────────────┬───────────────┐');
  console.log('│   BACKLOG     │   PLANNED     │   ACTIVE      │     DONE      │');
  console.log('├───────────────┼───────────────┼───────────────┼───────────────┤');

  // Find max rows
  const maxRows = Math.max(
    board.columns.backlog.length,
    board.columns.planned.length,
    board.columns.active.length,
    board.columns.done.length,
    1
  );

  for (let i = 0; i < maxRows; i++) {
    const backlog = board.columns.backlog[i];
    const planned = board.columns.planned[i];
    const active = board.columns.active[i];
    const done = board.columns.done[i];

    const formatCard = (card?: StoryCard): string => {
      if (!card) return '               ';

      const priorityIcon = {
        'critical': '🔴',
        'high': '🟠',
        'medium': '🟡',
        'low': '🟢'
      }[card.priority] || '⚪';

      const progress = card.tasks.total > 0
        ? `${card.tasks.completed}/${card.tasks.total}`
        : `${card.ac.passed}/${card.ac.total}`;

      return `${card.id} ${priorityIcon} ${progress}`.padEnd(15);
    };

    console.log(
      `│ ${formatCard(backlog)}│ ${formatCard(planned)}│ ${formatCard(active)}│ ${formatCard(done)}│`
    );
  }

  console.log('└───────────────┴───────────────┴───────────────┴───────────────┘');
  console.log('');

  // Features summary
  console.log('📦 Features:');
  for (const feature of board.features) {
    const statusIcon = {
      'planning': '📋',
      'active': '🔨',
      'complete': '✅',
      'archived': '📦'
    }[feature.status] || '📁';

    const storyCount = feature.stories.length;
    const activeCount = feature.stories.filter(s => s.status === 'in-progress' || s.status === 'active').length;
    const doneCount = feature.stories.filter(s => s.status === 'done' || s.status === 'complete').length;

    console.log(`  ${statusIcon} ${feature.name} (${feature.epic})`);
    console.log(`     ${doneCount}/${storyCount} done, ${activeCount} active`);
  }

  console.log('');

  // Stats
  console.log('📈 Stats:');
  console.log(`  Total stories: ${board.stats.total}`);
  console.log(`  By status: ${Object.entries(board.stats.byStatus).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
  console.log(`  By priority: ${Object.entries(board.stats.byPriority).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
  console.log('');
}

// ============================================================================
// Main
// ============================================================================

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📊 Loom Board View Generator

Usage:
  # Show full board
  bun .agent/loom/scripts/board-view.ts

  # Show specific feature
  bun .agent/loom/scripts/board-view.ts --feature metrics-dashboard

  # JSON output
  bun .agent/loom/scripts/board-view.ts --json

Options:
  --feature <name>  Show only specific feature
  --json            Output as JSON
  --help, -h        Show this help
`);
    process.exit(0);
  }

  const featuresDir = '.claude/loom/features';
  const features = scanFeatures(featuresDir);

  // Filter by feature if requested
  const featureIndex = args.indexOf('--feature');
  const featureFilter = featureIndex !== -1 && featureIndex + 1 < args.length
    ? args[featureIndex + 1]
    : undefined;
  const filteredFeatures = featureFilter
    ? features.filter(f => f.name === featureFilter)
    : features;

  const board = generateBoardView(filteredFeatures);

  if (args.includes('--json')) {
    console.log(JSON.stringify(board, null, 2));
  } else {
    visualizeBoard(board);
  }
}

main();
