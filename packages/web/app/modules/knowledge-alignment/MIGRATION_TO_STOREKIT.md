# Knowledge Alignment: SQLite to Store-Kit Migration Guide

## Overview

This document outlines the future migration path for converting the Knowledge Alignment system from SQLite to the store-kit document-based storage system.

**Estimated Effort**: 3-4 days of development work

## Benefits of Migration

1. **Version History**: Every edit to knowledge cards is tracked automatically
2. **Offline Support**: Works without server connection
3. **Real-time Sync**: Multiple users can edit simultaneously
4. **Undo/Redo**: Built-in with version tracking
5. **Branching**: Create experimental knowledge bases
6. **File-based Storage**: Easy backup, no database needed
7. **Export/Import**: Trivial with JSON files

## Data Model Transformation

### Current SQLite Schema
```sql
- knowledge_cards (id, title, summary, content, examples, tags, category, etc.)
- prompt_templates (id, name, description, card_ids, is_default, etc.)
- tags (id, name, description, color, category)
- card_usage_stats (card_id, usage_count, last_used, effectiveness)
- knowledge_config (id, config)
```

### Proposed Store-Kit Structure

#### Document Types
1. **knowledge-card**: Individual card documents
2. **knowledge-template**: Template documents
3. **knowledge-config**: System configuration

#### Context Types
```typescript
interface KnowledgeCardDocument {
  id: string;
  card: KnowledgeCard;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

interface KnowledgeAlignmentContext {
  id: string;
  title: string;
  cards: KnowledgeCard[];
  templates: PromptTemplate[];
  tags: Tag[];
  config: KnowledgeAlignmentConfig;
  stats: Record<string, CardUsageStats>;
  createdAt: Date;
  updatedAt: Date;
}
```

## Implementation Steps

### 1. Create Store-Kit Infrastructure

```typescript
// app/modules/knowledge-alignment/store/types.ts
type KnowledgeEventPayloads = {
  "card:create": { card: Omit<KnowledgeCard, "id"> };
  "card:update": { id: string; updates: Partial<KnowledgeCard> };
  "card:delete": { id: string };
  "template:create": { template: Omit<PromptTemplate, "id"> };
  "template:update": { id: string; updates: Partial<PromptTemplate> };
  "template:delete": { id: string };
  "config:update": { config: Partial<KnowledgeAlignmentConfig> };
  "usage:record": { cardId: string };
};
```

### 2. Implement Storage Adapter

```typescript
// app/modules/knowledge-alignment/store/adapter.ts
const knowledgeAlignmentAdapter = createAdapter({
  type: "knowledge-alignment",
  defaultContext: createDefaultKnowledgeContext(),
  // ... adapter implementation
});
```

### 3. Update Routes

Convert all routes to use store-kit patterns:

```typescript
// Before (SQLite)
export async function loader() {
  const cards = knowledgeDB.searchCards();
  return Response.json({ cards });
}

// After (Store-Kit)
export const loader = createStorageLoader(knowledgeAlignmentAdapter, {
  type: "knowledge-alignment",
  id: "default",
  defaultContext: createDefaultContext(),
});
```

### 4. Create Migration Script

```typescript
// scripts/migrate-knowledge-to-storekit.ts
async function migrateKnowledgeAlignment() {
  // 1. Read all data from SQLite
  const cards = knowledgeDB.searchCards();
  const templates = knowledgeDB.getAllTemplates();
  const config = knowledgeDB.getConfig();
  
  // 2. Create store-kit context
  const context: KnowledgeAlignmentContext = {
    id: "default",
    title: "Knowledge Alignment",
    cards,
    templates,
    tags: extractUniqueTags(cards),
    config,
    stats: buildUsageStats(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // 3. Write to store-kit
  await knowledgeAlignmentAdapter.write({
    type: "knowledge-alignment",
    id: "default",
    context,
  });
}
```

## Challenges and Solutions

### 1. Search Performance
**Challenge**: SQLite queries are fast; store-kit needs indexing
**Solution**: Implement in-memory indexing on context load

### 2. Relationships
**Challenge**: Foreign keys become document references
**Solution**: Use IDs and maintain referential integrity in event handlers

### 3. Aggregations
**Challenge**: Usage stats need custom implementation
**Solution**: Track stats in context and update via events

### 4. Concurrent Editing
**Challenge**: Multiple users editing same cards
**Solution**: Use store-kit's built-in conflict resolution

## Migration Checklist

- [ ] Create store-kit types and context definitions
- [ ] Implement storage adapter
- [ ] Create event handlers for all operations
- [ ] Update all routes to use loaders/actions
- [ ] Convert components to use store hooks
- [ ] Write migration script
- [ ] Test migration with production data
- [ ] Update API integration points
- [ ] Update documentation
- [ ] Plan rollback strategy

## Rollback Plan

1. Keep SQLite implementation in parallel during transition
2. Feature flag to switch between implementations
3. Export functionality to backup data before migration
4. Maintain SQLite schema for 30 days post-migration

## Future Enhancements

Once migrated to store-kit:
1. **Branching**: Create experimental knowledge bases
2. **Collaboration**: Real-time multi-user editing
3. **History View**: See how knowledge evolved over time
4. **Diff View**: Compare versions of knowledge cards
5. **Export/Import**: Share knowledge bases between teams

## Notes

- Store-kit's file-based approach makes backup trivial
- Version history enables audit trails
- Offline support improves reliability
- No database setup simplifies deployment