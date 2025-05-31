# MoneyWorks CLI Tools

This document describes the CLI tools available in the mw-core package for interacting with MoneyWorks data.

## Installation

The CLI tools are part of the mw-core package. To use them, you need to:

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/yourusername/mw-core.git
   cd mw-core
   bun install
   ```

2. Configure MoneyWorks connection as described in the main README.

## Available Commands

### align-export

Aligns TSV exports with XML-verbose exports to identify field order mismatches.

```bash
bun src/cli/mw-cli.ts align-export [options]
```

Options:
- `-t, --table <table>` - Specific table to check (default: all tables)
- `-o, --output <file>` - Output file for the report (default: "alignment-report.md")

This tool compares the fields available in both TSV and XML-verbose export formats, identifying any fields that are present in one format but missing in the other or fields that appear in different orders. It creates a markdown report summarizing the findings and including sample data from each format.

### list-tables

Lists all tables available in the MoneyWorks database.

```bash
bun src/cli/mw-cli.ts list-moneyworks [options]
```

Options:
- `-f, --format <format>` - Output format (text or json) (default: "text")

Example output (text format):
```
account
assetcat
assetlog
autosplit
bankrecs
build
contacts
...
```

Example output (json format):
```json
[
  "account",
  "assetcat",
  "assetlog",
  "autosplit",
  "bankrecs",
  "build",
  "contacts",
  ...
]
```

### list-fields

Lists all fields in a specific MoneyWorks table.

```bash
bun src/cli/mw-cli.ts list-fields <table> [options]
```

Arguments:
- `<table>` - Name of the table to get fields from

Options:
- `-f, --format <format>` - Output format (text, json, tsv, or csv) (default: "text")
- `-t, --with-type` - Include field type information (cannot be used with tsv or csv formats)

Example output (text format):
```
Code
Description
Type
System
...
```

Example output (json format):
```json
[
  "Code",
  "Description",
  "Type",
  "System",
  ...
]
```

Example output (with type information):
```
Code: VARCHAR (string)
Description: VARCHAR (string)
Type: VARCHAR (string)
System: BOOLEAN (boolean)
...
```

Example output (tsv format):
```
Code	Description	Type	System	...
```

Example output (csv format):
```
Code,Description,Type,System,...
```

The tsv and csv formats are particularly useful for creating headers for exports or for copying directly into spreadsheet applications.

## Usage Notes

- All commands require proper MoneyWorks configuration in `mw-config.json`
- The tsv and csv formats for `list-fields` cannot be used with the `--with-type` option
- When a table is not found, the tool will display a list of available tables
- For field types, the tool shows both the MoneyWorks type and the JavaScript equivalent type (when available)