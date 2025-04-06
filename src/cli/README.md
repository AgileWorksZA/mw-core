# MoneyWorks CLI

A command-line interface for MoneyWorks development and troubleshooting tasks.

## Installation

The CLI is part of the mw-core package and can be run using:

```bash
bun run cli [command] [options]
```

## Available Commands

### align-export

Aligns TSV exports with XML-verbose exports to identify mismatches in field ordering.

```bash
bun run cli align-export [options]
```

Options:
- `-t, --table <table>` - Specify a single table to check (default: all tables)
- `-o, --output <output>` - Output file for the report (default: alignment-report.md)

### list-tables

Lists all tables available in the MoneyWorks database.

```bash
bun run cli list-tables [options]
```

Options:
- `-f, --format <format>` - Output format: "text" or "json" (default: text)

#### Output Formats

- **Text format**: One table name per line, suitable for piping to other commands
- **JSON format**: Array of table names in JSON format

#### Examples:

```bash
# List all tables in text format
bun run cli list-tables

# Get tables in JSON format
bun run cli list-tables --format json

# Pipe to grep to find specific tables
bun run cli list-tables | grep "asset"

# Save the list to a file
bun run cli list-tables > tables.txt
```

### list-fields

Lists all fields in a specific MoneyWorks table.

```bash
bun run cli list-fields <table> [options]
```

Arguments:
- `<table>` - (Required) Name of the table to get fields from

Options:
- `-f, --format <format>` - Output format: "text" or "json" (default: text)
- `-t, --with-type` - Include field type information (default: false)

#### Output Formats

- **Text format**: 
  - Without `--with-type`: One field name per line
  - With `--with-type`: Format `fieldName: type (jsType)` per line
- **JSON format**: 
  - Without `--with-type`: Array of field names
  - With `--with-type`: Array of objects with name, type, and jsType properties

#### Examples:

```bash
# List all fields in the Account table
bun run cli list-fields Account

# Get fields with type information
bun run cli list-fields Account --with-type

# Get fields from Transaction table in JSON format with type information
bun run cli list-fields Transaction --format json --with-type

# Pipe to grep to find specific fields
bun run cli list-fields Name | grep "Address"

# Combine with list-tables to process multiple tables
bun run cli list-tables | grep "Asset" | xargs -I{} bun run cli list-fields {}

# Save the field list to a file
bun run cli list-fields Product > product_fields.txt
```

#### Field Types

When using the `--with-type` option, the command shows:

1. The raw MoneyWorks field type:
   - `SHORT`, `LONG`, `INT48` - Integer number types
   - `FLOAT`, `DOUBLE` - Floating point number types
   - `BOOLEAN` - Boolean type
   - `DATE`, `TIME` - Date/time types
   - Numeric value (e.g., `8`, `64`) - String with maximum length

2. The corresponding JavaScript type:
   - `number` - For numeric fields (SHORT, LONG, INT48, FLOAT, DOUBLE)
   - `boolean` - For boolean fields
   - `Date` - For date/time fields (DATE, TIME)
   - `string` - For string fields with length specification

Example output:
```
Code: 8 (string)
Type: SHORT (number)
BookValue: DOUBLE (number)
AcquisitionDate: DATE (Date)
```

#### What It Does

The `align-export` command:

1. Fetches data from each table in both XML-verbose and TSV formats
2. Compares the field order between the two export formats
3. Identifies:
   - Fields that are missing in the TSV export
   - Extra fields in the TSV export
   - Fields that appear in a different order
4. Generates a markdown report with suggested fixes

#### Example Report

The report includes:

- A summary table showing all tables and their alignment status
- Detailed analysis for each table with issues
- Suggested field orders for tables that need fixing

Example usage:

```bash
# Check all tables
bun run cli align-export

# Check only the Account table
bun run cli align-export --table Account

# Save the report to a custom location
bun run cli align-export --output ./reports/alignment.md
```

## Adding New CLI Tools

To add a new tool to the CLI:

1. Create a new file in the `src/cli/tools/` directory
2. Export a function that implements the tool's functionality
3. Add a new command to `src/cli/mw-cli.ts`

The CLI uses Commander.js for parsing commands and options.