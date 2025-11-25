# MoneyWorks API Recipes & Patterns

This section contains "battle-tested" patterns for interacting with the MoneyWorks Datacentre REST API. These recipes are derived from the official `mw-core` reference implementation.

## Core Patterns

1.  [**Authentication & Connection**](api-patterns.md#1-authentication--connection-url-construction): The unique way MoneyWorks handles credentials.
2.  [**The "Hybrid Export" Performance Pattern**](api-patterns.md#2-the-hybrid-export-pattern-performance): How to get the speed of TSV with the safety of XML.
3.  [**Error Handling Heuristics**](api-patterns.md#3-error-handling-heuristics): Detecting errors that disguise themselves as successful responses.
4.  [**Data Type Conversion**](api-patterns.md#4-data-type-conversion): Handling MoneyWorks-specific formats (YYYYMMDD, "1"/"0").

## Code Examples

*   See `api-patterns.md` for TypeScript examples.
