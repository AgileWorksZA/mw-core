# Knowledge Alignment: Hybrid Approach Design

## Overview

The Knowledge Alignment System uses a **hybrid approach** that combines:
1. **MCP Tool Descriptions** - Technical specifications in the tool definitions
2. **Knowledge Cards** - Business context and domain expertise in the system

This separation ensures clean architecture, maintainability, and optimal AI performance.

## Design Philosophy

### Core Principle
> "Technical specifications with the implementation, business knowledge with the knowledge base"

### Benefits
- **Clean Separation**: Technical changes don't affect business knowledge
- **User Control**: Business users can manage knowledge without touching code
- **AI Optimization**: AI gets precise syntax from tools AND rich context from cards
- **Maintainability**: Updates are targeted to the right location

## What Goes Where?

### MCP Tool Descriptions
Located in the MCP server tool definitions. Contains:
- Parameter formats (e.g., `NameType='C'` for customers)
- Field names and data types
- Valid enum values
- API constraints and limits
- Direct usage syntax
- Required vs optional parameters

Example:
```javascript
{
  name: "names",
  description: "Query MoneyWorks Names (customers/suppliers). Filter by: NameType='C' (customers), NameType='S' (suppliers), NameType='CS' (both). Use 'filter' parameter with SQL-like syntax.",
  parameters: {
    operation: "search | get | listFields",
    filter: "SQL-like filter expression",
    limit: "Max results (default: 50)"
  }
}
```

### Knowledge Cards
Stored in the Knowledge Alignment System. Contains:
- Business concepts and context
- Why and when to use specific features
- Common workflows and procedures
- Edge cases and gotchas
- Best practices
- Troubleshooting guides

## Card Categories

### Tool Companion Cards
Special cards that provide business context for specific MCP tools:
- Links directly to MCP tools via `mcpTools` field
- Explains the "why" behind the "how"
- Provides real-world scenarios
- Documents edge cases

### Business Knowledge Cards
- **Concept**: Core MoneyWorks concepts (e.g., double-entry accounting)
- **Workflow**: Step-by-step procedures (e.g., month-end closing)
- **Business Rule**: Logic and compliance requirements
- **Common Mistake**: What to avoid and why
- **Troubleshooting**: Problem diagnosis and resolution

### Technical Knowledge Cards
- **Data Structure**: Database relationships and schemas
- **Integration**: External system connections
- **MWScript**: Scripting and automation

## Implementation

### 1. Tool-Level Implementation
In your MCP server, enhance tool descriptions:
```typescript
tools: [
  {
    name: "transactions",
    description: "Query transactions. Status codes: OP=Open/Unposted, CL=Closed/Posted, PA=Partial, CA=Cancelled. Types: SI=Sales Invoice, PI=Purchase Invoice...",
    // Technical specs here
  }
]
```

### 2. Knowledge Card Creation
Create companion cards for tools:
```typescript
{
  title: "Transactions Tool: Understanding Status Codes",
  category: "tool-companion",
  mcpTools: ["transactions"],
  content: "Business meaning behind status codes...",
  // Business context here
}
```

### 3. Templates for Organization
Use templates to group related knowledge:
- **Tool Companion Cards**: All tool-related business context
- **Complete Knowledge**: Everything for comprehensive coverage
- **Troubleshooting Kit**: Focused on problem-solving
- **Business User Essentials**: Non-technical knowledge

## Usage Example

When a user asks: "Show me all unpaid customer invoices"

1. **Tool Description** provides:
   - `type='SI'` for Sales Invoice
   - `status='OP'` for Open
   - `filter` parameter syntax

2. **Knowledge Card** explains:
   - What "unpaid" means in MoneyWorks context
   - Why Open status indicates unpaid
   - Common issues with partial payments
   - Best practices for invoice management

## Best Practices

### For MCP Tool Descriptions
- Keep it concise and technical
- Focus on "how to use"
- List all valid parameters
- Include format examples
- Document constraints

### For Knowledge Cards
- Explain business context
- Use real-world examples
- Include correct/incorrect patterns
- Link to relevant tools
- Provide troubleshooting tips

## Maintenance

### When to Update Tools
- API changes
- New parameters added
- Format changes
- Bug fixes in tool behavior

### When to Update Cards
- Business process changes
- New use cases discovered
- Common user questions
- Lessons learned from errors

## Future Enhancements

1. **Auto-sync**: Automatically generate basic tool companion cards
2. **Usage Analytics**: Track which cards help resolve issues
3. **AI Feedback Loop**: Learn from successful interactions
4. **Version Control**: Track changes to knowledge over time