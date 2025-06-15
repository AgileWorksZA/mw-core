# MoneyWorks Core Architecture: Core, MCP, and CLI

## Overview

This document describes the relationship between the three main packages in the MoneyWorks ecosystem:
- **@moneyworks/core**: The foundational TypeScript library
- **@moneyworks/mcp-server**: Model Context Protocol server for AI assistants
- **@moneyworks/cli**: Command-line interface for developers

## Architecture Diagram

```mermaid
graph TB
    subgraph "External Systems"
        MW[MoneyWorks Datacentre<br/>REST API & CLI]
        CD[Claude Desktop<br/>AI Assistant]
        DEV[Developer<br/>Terminal]
    end

    subgraph "@moneyworks/core"
        subgraph "REST Layer"
            RC[MoneyWorksRESTClient]
            AUTH[Auth Handler]
            ERR[Error Handler]
        end
        
        subgraph "Data Layer"
            TABLES[Table Interfaces<br/>Account, Transaction,<br/>Name, Product, etc.]
            SCHEMAS[Zod Schemas<br/>Self-documenting<br/>validation]
            TYPES[TypeScript Types<br/>& Enums]
        end
        
        subgraph "Operations Layer"
            EXPORT[Export/Import<br/>XML ↔ JSON]
            PARSER[Data Parsers<br/>TSV, XML]
            CLIWRAP[CLI Wrapper<br/>for special ops]
        end
    end

    subgraph "@moneyworks/mcp-server"
        subgraph "Service Layer"
            BS[BaseTableService]
            AS[AccountService]
            TS[TransactionService]
            NS[NameService]
            BUS[BuildService]
            TKS[TicketService]
        end
        
        subgraph "MCP Tools (45)"
            AT[account_operations]
            TT[transaction_operations]
            NT[name_operations]
            BT[build_operations]
            CT[moneyworks_core<br/>41 system tools]
            LT[log_ticket]
        end
        
        subgraph "MCP Infrastructure"
            MCPS[McpServer]
            STDIO[StdioTransport]
        end
    end

    subgraph "@moneyworks/cli"
        subgraph "Commands"
            EXPCMD[export]
            IMPCMD[import]
            EVALCMD[evaluate]
            GRCMD[generate-report]
            POSTCMD[post]
            VERCMD[version]
        end
        
        subgraph "CLI Infrastructure"
            ARGP[Argument Parser]
            CONF[Config Loader]
            OUT[Output Formatter]
        end
    end

    %% External connections
    MW <-->|REST API| RC
    MW <-->|CLI exec| CLIWRAP
    CD <-->|MCP Protocol| MCPS
    DEV -->|Commands| ARGP

    %% Core internal connections
    RC --> AUTH
    RC --> ERR
    RC --> EXPORT
    EXPORT --> PARSER
    TABLES --> TYPES
    SCHEMAS --> TABLES

    %% MCP internal connections
    BS --> RC
    AS --> BS
    TS --> BS
    NS --> BS
    BUS --> BS
    
    AT --> AS
    TT --> TS
    NT --> NS
    BT --> BUS
    CT --> RC
    CT --> CLIWRAP
    LT --> TKS
    
    MCPS --> AT
    MCPS --> TT
    MCPS --> NT
    MCPS --> BT
    MCPS --> CT
    MCPS --> LT
    
    %% CLI internal connections
    ARGP --> CONF
    CONF --> RC
    EXPCMD --> RC
    IMPCMD --> RC
    EVALCMD --> RC
    GRCMD --> RC
    POSTCMD --> RC
    VERCMD --> RC
    OUT --> DEV

    %% Schema usage
    SCHEMAS -.->|Validation| AT
    SCHEMAS -.->|Validation| TT
    SCHEMAS -.->|Validation| NT
    SCHEMAS -.->|Validation| BT
    SCHEMAS -.->|Validation| CT

    classDef core fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef mcp fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef cli fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef external fill:#fff3e0,stroke:#e65100,stroke-width:2px

    class MW,CD,DEV external
    class RC,AUTH,ERR,TABLES,SCHEMAS,TYPES,EXPORT,PARSER,CLIWRAP core
    class BS,AS,TS,NS,BUS,TKS,AT,TT,NT,BT,CT,LT,MCPS,STDIO mcp
    class EXPCMD,IMPCMD,EVALCMD,GRCMD,POSTCMD,VERCMD,ARGP,CONF,OUT cli
```

## Package Relationships

### 1. @moneyworks/core (Foundation Layer)

The core package provides the fundamental building blocks:

- **REST Client**: Handles all HTTP communication with MoneyWorks Datacentre
- **Type System**: Strongly-typed interfaces for all MoneyWorks tables
- **Schemas**: Zod schemas for runtime validation and self-documentation
- **Data Conversion**: XML ↔ JSON conversion with type safety
- **CLI Wrapper**: Executes MoneyWorks CLI for operations not in REST API

**Key exports**:
```typescript
// Main client
export { MoneyWorksRESTClient } from "./rest";

// Table types
export * from "./tables";

// Schemas for validation
export * from "./schemas";

// CLI wrapper for special operations
export { MoneyWorksCLI } from "./cli/wrapper";
```

### 2. @moneyworks/mcp-server (AI Integration Layer)

The MCP server exposes MoneyWorks functionality to AI assistants:

- **Service Layer**: Wraps core REST client with business logic
- **45 MCP Tools**: 4 table tools + 41 system tools
- **Error Tracking**: SQLite-based ticket system for improvements
- **Type Safety**: Uses core schemas for parameter validation

**Architecture**:
```
Claude Desktop → MCP Protocol → MCP Server → Service Layer → Core REST Client → MoneyWorks
```

**Tool Categories**:
- Table Operations (4): account, transaction, name, build
- System Operations (41): validation, permissions, calculations, etc.
- Error Tracking (1): log_ticket for continuous improvement

### 3. @moneyworks/cli (Developer Interface Layer)

The CLI provides command-line access to MoneyWorks:

- **Direct REST Access**: Uses core REST client
- **Developer-Friendly**: Commands map to common operations
- **Flexible Output**: JSON, XML, TSV formats
- **Streaming Support**: For large datasets

**Command Flow**:
```
Developer → CLI Command → Argument Parser → Core REST Client → MoneyWorks
```

## Data Flow Examples

### Example 1: AI Assistant Queries Accounts
```
1. Claude Desktop: "Show me all bank accounts"
2. MCP Server: Receives tool call for account_operations
3. AccountService: Builds filter "Type='BA'"
4. Core REST Client: GET /REST/.../export?table=Account&filter=Type="BA"
5. MoneyWorks: Returns XML data
6. Core Parser: Converts XML to JSON with types
7. MCP Server: Returns formatted JSON to Claude
```

### Example 2: Developer Exports Transactions
```
1. Developer: mw export Transaction --limit 100 --format json
2. CLI Parser: Parses arguments and options
3. Core REST Client: GET /REST/.../export?table=Transaction&limit=100
4. MoneyWorks: Returns XML data (limited to 100)
5. Core Parser: Converts to JSON array
6. CLI Output: Prints JSON to stdout
```

### Example 3: Complex Calculation via MCP
```
1. Claude: Uses moneyworks_core tool with calculation operation
2. MCP Server: Routes to calculation handler
3. Core CLI Wrapper: Executes MoneyWorks CLI for evaluate
4. MoneyWorks CLI: Evaluates expression
5. Results flow back through the stack
```

## Key Design Principles

1. **Separation of Concerns**:
   - Core: Pure data access and types
   - MCP: AI-specific adapters and tools
   - CLI: Developer-specific commands

2. **Type Safety Throughout**:
   - TypeScript interfaces in core
   - Zod schemas for runtime validation
   - Type narrowing at boundaries

3. **Reusability**:
   - Core package used by both MCP and CLI
   - Shared schemas ensure consistency
   - Common error handling patterns

4. **Progressive Enhancement**:
   - Core provides low-level access
   - Services add business logic
   - Tools/Commands add use-case specific features

## Configuration Flow

```
mw-config.json
    ↓
┌─────────────┬─────────────┬──────────────┐
│     CLI     │  MCP Server │   Core       │
│ (uses core) │ (uses core) │ (base config)│
└─────────────┴─────────────┴──────────────┘
```

All three packages share the same configuration format, ensuring consistency across different access methods.

## Future Extensibility

The architecture supports future additions:
- New table types: Add to core → Available everywhere
- New MCP tools: Add to MCP server → Available to AI
- New CLI commands: Add to CLI → Available to developers
- New export formats: Add to core → Available everywhere

This modular approach ensures that improvements in one area benefit the entire ecosystem.