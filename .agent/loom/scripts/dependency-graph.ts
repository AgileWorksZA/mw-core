#!/usr/bin/env bun
/**
 * Loom Dependency Graph Utility
 *
 * Validates task dependencies and generates execution order.
 * Detects circular dependencies and creates topological sort.
 *
 * Usage:
 *   bun .agent/loom/scripts/dependency-graph.ts US-001
 *   bun .agent/loom/scripts/dependency-graph.ts US-001 --visualize
 *   bun .agent/loom/scripts/dependency-graph.ts US-001 --sequence
 */

import { readFileSync, existsSync } from 'fs';

// ============================================================================
// Types
// ============================================================================

interface Task {
  id: string;
  title: string;
  assignedAgent: string;
  dependencies: string[];
  status: string;
}

interface Story {
  id: string;
  title: string;
  tasks: Task[];
}

interface GraphNode {
  id: string;
  task: Task;
  dependencies: GraphNode[];
  dependents: GraphNode[];
}

interface ExecutionPhase {
  phase: number;
  tasks: Task[];
  parallel: boolean;
}

// ============================================================================
// Graph Construction
// ============================================================================

function buildGraph(tasks: Task[]): Map<string, GraphNode> {
  const nodes = new Map<string, GraphNode>();

  // Create nodes
  for (const task of tasks) {
    nodes.set(task.id, {
      id: task.id,
      task,
      dependencies: [],
      dependents: []
    });
  }

  // Link dependencies
  for (const task of tasks) {
    const node = nodes.get(task.id)!;

    for (const depId of task.dependencies) {
      const depNode = nodes.get(depId);
      if (depNode) {
        node.dependencies.push(depNode);
        depNode.dependents.push(node);
      }
    }
  }

  return nodes;
}

// ============================================================================
// Cycle Detection
// ============================================================================

function detectCycles(nodes: Map<string, GraphNode>): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recStack = new Set<string>();

  function dfs(nodeId: string, path: string[]): void {
    visited.add(nodeId);
    recStack.add(nodeId);
    path.push(nodeId);

    const node = nodes.get(nodeId)!;
    for (const dep of node.dependencies) {
      if (!visited.has(dep.id)) {
        dfs(dep.id, [...path]);
      } else if (recStack.has(dep.id)) {
        // Found cycle
        const cycleStart = path.indexOf(dep.id);
        const cycle = path.slice(cycleStart);
        cycle.push(dep.id); // Complete the cycle
        cycles.push(cycle);
      }
    }

    recStack.delete(nodeId);
  }

  for (const nodeId of nodes.keys()) {
    if (!visited.has(nodeId)) {
      dfs(nodeId, []);
    }
  }

  return cycles;
}

// ============================================================================
// Topological Sort
// ============================================================================

function topologicalSort(nodes: Map<string, GraphNode>): ExecutionPhase[] {
  const phases: ExecutionPhase[] = [];
  const completed = new Set<string>();
  const inDegree = new Map<string, number>();

  // Calculate in-degrees
  for (const [id, node] of nodes) {
    inDegree.set(id, node.dependencies.length);
  }

  let phaseNum = 1;
  while (completed.size < nodes.size) {
    // Find all tasks with no remaining dependencies
    const ready: Task[] = [];

    for (const [id, node] of nodes) {
      if (!completed.has(id) && inDegree.get(id) === 0) {
        ready.push(node.task);
      }
    }

    if (ready.length === 0) {
      // No progress possible - there must be a cycle
      break;
    }

    // Add phase
    phases.push({
      phase: phaseNum++,
      tasks: ready,
      parallel: ready.length > 1
    });

    // Mark as completed and update dependents
    for (const task of ready) {
      completed.add(task.id);

      const node = nodes.get(task.id)!;
      for (const dependent of node.dependents) {
        const currentDegree = inDegree.get(dependent.id)!;
        inDegree.set(dependent.id, currentDegree - 1);
      }
    }
  }

  return phases;
}

// ============================================================================
// Visualization
// ============================================================================

function visualizeGraph(nodes: Map<string, GraphNode>): void {
  console.log('\n📊 Task Dependency Graph:\n');

  for (const [id, node] of nodes) {
    const task = node.task;
    console.log(`${id}: ${task.title}`);
    console.log(`  Role: ${task.assignedAgent}`);
    console.log(`  Status: ${task.status}`);

    if (node.dependencies.length > 0) {
      console.log(`  Depends on: ${node.dependencies.map(d => d.id).join(', ')}`);
    } else {
      console.log(`  Depends on: (none - can start immediately)`);
    }

    if (node.dependents.length > 0) {
      console.log(`  Blocks: ${node.dependents.map(d => d.id).join(', ')}`);
    }

    console.log('');
  }
}

function visualizeSequence(phases: ExecutionPhase[]): void {
  console.log('\n🎯 Execution Sequence:\n');

  for (const phase of phases) {
    const parallelStr = phase.parallel ? ' (PARALLEL)' : ' (sequential)';
    console.log(`Phase ${phase.phase}${parallelStr}:`);

    for (const task of phase.tasks) {
      console.log(`  - ${task.id}: ${task.title} (${task.assignedAgent})`);
    }

    console.log('');
  }

  // Summary
  const totalTasks = phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const parallelPhases = phases.filter(p => p.parallel).length;

  console.log('📈 Summary:');
  console.log(`  Total tasks: ${totalTasks}`);
  console.log(`  Execution phases: ${phases.length}`);
  console.log(`  Parallel opportunities: ${parallelPhases} phases`);
  console.log('');
}

// ============================================================================
// Validation
// ============================================================================

function validateGraph(story: Story): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  const nodes = buildGraph(story.tasks);

  // Check for cycles
  const cycles = detectCycles(nodes);
  if (cycles.length > 0) {
    errors.push(`Found ${cycles.length} circular dependencies:`);
    for (const cycle of cycles) {
      errors.push(`  ${cycle.join(' → ')}`);
    }
  }

  // Check for missing dependencies
  for (const task of story.tasks) {
    for (const depId of task.dependencies) {
      if (!nodes.has(depId)) {
        errors.push(`Task ${task.id} depends on non-existent task: ${depId}`);
      }
    }
  }

  // Check for orphaned tasks (no dependencies and no dependents)
  for (const [id, node] of nodes) {
    if (node.dependencies.length === 0 && node.dependents.length === 0 && nodes.size > 1) {
      warnings.push(`Task ${id} has no dependencies or dependents (orphaned)`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ============================================================================
// Main
// ============================================================================

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📊 Loom Dependency Graph

Usage:
  # Validate dependencies
  bun .agent/loom/scripts/dependency-graph.ts US-001

  # Visualize graph
  bun .agent/loom/scripts/dependency-graph.ts US-001 --visualize

  # Show execution sequence
  bun .agent/loom/scripts/dependency-graph.ts US-001 --sequence

  # Both visualization and sequence
  bun .agent/loom/scripts/dependency-graph.ts US-001 --visualize --sequence

Purpose:
  - Detect circular dependencies
  - Validate task relationships
  - Generate execution order (topological sort)
  - Identify parallel execution opportunities
`);
    process.exit(0);
  }

  if (args.length === 0) {
    console.error('❌ Story ID required');
    console.error('   Usage: bun .agent/loom/scripts/dependency-graph.ts US-001');
    process.exit(1);
  }

  const storyId = args[0];
  const storyPath = `.claude/loom/stories/${storyId}.json`;

  if (!existsSync(storyPath)) {
    console.error(`❌ Story not found: ${storyPath}`);
    process.exit(1);
  }

  const story: Story = JSON.parse(readFileSync(storyPath, 'utf-8'));

  if (!story.tasks || story.tasks.length === 0) {
    console.log('ℹ️  No tasks in story yet');
    console.log('   Use task-create.ts to add tasks');
    process.exit(0);
  }

  console.log(`\n📋 Analyzing ${story.id}: ${story.title}`);
  console.log(`   Tasks: ${story.tasks.length}`);

  // Validate
  const validation = validateGraph(story);

  if (validation.errors.length > 0) {
    console.log('\n❌ Validation Errors:\n');
    for (const error of validation.errors) {
      console.log(`  ${error}`);
    }
    console.log('');
    process.exit(1);
  }

  if (validation.warnings.length > 0) {
    console.log('\n⚠️  Warnings:\n');
    for (const warning of validation.warnings) {
      console.log(`  ${warning}`);
    }
    console.log('');
  }

  if (validation.valid) {
    console.log('\n✅ Dependencies are valid - no cycles detected');
  }

  // Visualize
  if (args.includes('--visualize')) {
    const nodes = buildGraph(story.tasks);
    visualizeGraph(nodes);
  }

  // Sequence
  if (args.includes('--sequence')) {
    const nodes = buildGraph(story.tasks);
    const phases = topologicalSort(nodes);
    visualizeSequence(phases);
  }

  if (!args.includes('--visualize') && !args.includes('--sequence')) {
    console.log('\nUse --visualize to see graph structure');
    console.log('Use --sequence to see execution order');
    console.log('');
  }
}

main();
