# MoneyWorks Core Monorepo

A comprehensive TypeScript-based toolkit for MoneyWorks accounting software, built with Bun.

## Structure

This is a Bun workspace monorepo containing the following packages:

- **`packages/canonical`**: Defines the pure, uncontaminated MoneyWorks canonical types, enums, and business logic.
- **`packages/cli`**: A command-line interface for interacting with MoneyWorks and testing core functionality.
- **`packages/core`**: The core TypeScript library, providing types, interfaces, and shared models for MoneyWorks.
- **`packages/data`**: The data access layer, including a REST client and repositories for interacting with the MoneyWorks API.
- **`packages/utils`**: Shared utility functions used across the other packages.

## Features

- **Canonical Data Model**: A well-defined, consistent data model for all MoneyWorks entities.
- **Command-Line Interface (CLI)**: Tools for testing, data export/import, and other interactions with MoneyWorks.
- **TypeScript-First**: Fully typed codebase for improved developer experience and code quality.
- **Modular Architecture**: A clean, organized codebase with a clear separation of concerns.
- **Bun-Powered**: Uses the Bun runtime for fast installation, testing, and execution.



## Setup

### Prerequisites

- [Bun](https://bun.sh/) runtime
- MoneyWorks Datacentre server with REST API enabled (port 6710 by default)
- API user account in MoneyWorks with appropriate permissions

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mw-core.git
   cd mw-core
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure MoneyWorks connection:
   - Copy `packages/cli/mw-config.example.json` to `mw-config.json` in the root directory.
   - Edit the configuration with your MoneyWorks server details.

## Development

### Quick Start

To start the command-line interface in development mode:
```bash
bun run mw
```

To run tests:
```bash
bun test
```

To build the CLI for production:
```bash
bun run build:cli
```



## Packages

### `packages/canonical`

This package contains the canonical data model for MoneyWorks. It defines the types, enums, and business logic for all MoneyWorks entities, ensuring a single source of truth for the data structures used throughout the project.

### `packages/cli`

The command-line interface for interacting with MoneyWorks. It provides a set of commands for common tasks such as:

- Testing the connection to MoneyWorks
- Listing tables and fields
- Exporting and importing data

### `packages/core`

The core library contains the fundamental building blocks of the project. It includes:

- TypeScript types and interfaces for MoneyWorks data
- Shared models and schemas
- Utility functions for working with MoneyWorks data

### `packages/data`

This package is responsible for all data access. It includes:

- A REST client for communicating with the MoneyWorks API
- Repositories for fetching and manipulating data
- Parsers for converting data between different formats

### `packages/utils`

A collection of shared utility functions, such as date and JSON helpers, used by the other packages in the monorepo.

## Workspace Development

This monorepo uses Bun workspaces, allowing packages to depend on each other. For example, the `@moneyworks/cli` package depends on the `@moneyworks/data` package:

```json
// packages/cli/package.json
{
  "dependencies": {
    "@moneyworks/data": "workspace:*"
  }
}
```

This enables clean imports between packages:

```typescript
import { MoneyWorksRestClient } from "@moneyworks/data/client";
```

## License

[MIT](LICENSE)