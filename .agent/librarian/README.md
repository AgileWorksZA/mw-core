# Librarian - Semantic File Index

**Version**: 1.0.0
**Last Updated**: 2025-11-23
**Files Indexed**: 48
**Git Commit**: 0e321139

## Overview

The Librarian provides semantic file discovery for the MoneyWorks Core codebase. Instead of searching by keywords, you can find files by **concept**, **domain**, **architectural pattern**, or **purpose**.

## Index Structure

### By Domain (8 domains)
- **api** (12 files) - REST API endpoints, controllers, middleware
- **auth** (3 files) - Authentication and connection management
- **canonical** (9 files) - Pure MoneyWorks type definitions
- **data-access** (10 files) - Data clients, parsers, repositories
- **utilities** (3 files) - Branded types, date handling, JSON revivers
- **mcp-server** (5 files) - MCP tools for AI agents
- **cli** (4 files) - Command-line interface
- **documentation** (2 files) - Skills and guides

### By Layer (6 layers)
- **config** (4 files) - Application entry points
- **routes** (6 files) - API route handlers
- **service** (8 files) - Business logic layer
- **schema** (8 files) - Type definitions
- **util** (12 files) - Utility functions
- **component** (6 files) - Reusable components

### Key Concepts (5 major areas)
- **authentication** - Bearer tokens, encrypted storage
- **data-access** - Smart client, field discovery
- **canonical-dsl** - Pure MoneyWorks types
- **api-layer** - REST endpoints with Elysia
- **type-safety** - Branded types

## Statistics

- **Total Files**: 48
- **Domains**: 8
- **Layers**: 6
- **Architectural Patterns**: 7
- **Indexing Cost**: ~$0.27 (9K tokens)

## Usage

Query the index programmatically or use `/librarian:find <concept>` command.
