# @moneyworks/cli

Command-line interface for MoneyWorks REST API operations using the canonical pure DSL.

## Status

**⚠️ Currently only supports TaxRate entity**

As part of the canonical DSL migration, this CLI currently only supports operations on the TaxRate entity. Additional entities will be added as they are vetted and added to the canonical DSL.

## Installation

```bash
# Install dependencies
bun install

# Build the CLI
bun run build
```

## Configuration

Create a `mw-config.json` file in your working directory:

```json
{
  "host": "your-moneyworks-server.com",
  "port": 6710,
  "protocol": "http",
  "dataFile": "YourCompany.moneyworks",
  "username": "ApiUser",
  "password": "yourpassword",
  "folderAuth": {
    "folderName": "CompanyFolder",
    "password": "folderPassword"
  }
}
```

Or use environment variables:
- `MW_HOST`
- `MW_PORT`
- `MW_USERNAME`
- `MW_PASSWORD`
- `MW_DATAFILE`

## Usage

### Export TaxRate Records

```bash
# Export all tax rates as JSON
bun run dev export TaxRate

# Export with filter
bun run dev export TaxRate --filter "TaxCode='GST10'"

# Export to file
bun run dev export TaxRate --output taxrates.json

# Export as TSV
bun run dev export TaxRate --format tsv --output taxrates.tsv

# Export as XML (verbose)
bun run dev export TaxRate --format xml-verbose

# Limit results
bun run dev export TaxRate --limit 10 --start 0
```

### Import TaxRate Records

```bash
# Import from JSON file
bun run dev import TaxRate taxrates.json

# Import with update mode
bun run dev import TaxRate taxrates.json --mode update

# Import with work-it-out mode
bun run dev import TaxRate taxrates.json --workItOut
```

### Evaluate Expressions

```bash
# Count tax rates
bun run dev eval "Count(TaxRate)"

# More complex expressions
bun run dev eval "Count(TaxRate WHERE Rate1=10)"
```

### Other Commands

```bash
# Test connection
bun run dev test-connection

# Get server version
bun run dev version

# List available documents
bun run dev list
```

## Export Formats

- `json` - JSON format (default)
- `xml-terse` - Compact XML format
- `xml-verbose` - Detailed XML format with all fields
- `tsv` - Tab-separated values

## Command Options

### Global Options
- `-c, --config <file>` - Config file path (default: ./mw-config.json)
- `-d, --debug` - Enable debug mode
- `-t, --timing` - Show timing information
- `-h, --help` - Show help
- `-v, --version` - Show version

### Export Options
- `-f, --format <format>` - Export format
- `--filter <expression>` - MoneyWorks filter expression
- `-l, --limit <number>` - Limit number of records
- `-s, --start <number>` - Start offset
- `-o, --orderBy <field>` - Order by field
- `-O, --output <file>` - Output to file

### Import Options
- `-m, --mode <mode>` - Import mode: create, update, createOrUpdate
- `-w, --workItOut` - Enable work-it-out mode
- `--calculated` - Include calculated fields

## TaxRate Fields

The TaxRate entity includes the following MoneyWorks canonical fields:
- `TaxCode` - The tax code identifier
- `PaidAccount` - Control account for GST paid
- `RecAccount` - Control account for GST received
- `Date` - Tax rate changeover date
- `Rate1` - Rate used before changeover date
- `Rate2` - Rate used on or after changeover date
- `GSTPaid` - GST paid description
- `GSTReceived` - GST received description
- `Combine` - Combine mode for multi-tier taxes
- And more...

## Building

### Create standalone binary

```bash
# Build for current platform
bun run build

# Build for specific platforms
bun build src/index.ts --compile --target=bun-linux-x64 --outfile mw-linux
bun build src/index.ts --compile --target=bun-darwin-arm64 --outfile mw-mac
bun build src/index.ts --compile --target=bun-windows-x64 --outfile mw.exe
```

### Create Node.js compatible build

```bash
bun run build:dist
```

## Development

This CLI is part of the MoneyWorks Core monorepo and uses:
- `@moneyworks/data` - Data access layer with REST client
- `@moneyworks/canonical` - Pure MoneyWorks DSL types
- `@moneyworks/utilities` - Branded types and utilities

```bash
# Run in development mode
bun run dev <command>

# Run with debug output
bun run dev <command> --debug

# Run with timing information
bun run dev <command> --timing
```

## Future Entities

The following entities will be added as they are vetted in the canonical DSL:
- Account
- Transaction  
- Name (Customers/Suppliers)
- Product
- Department
- Job
- And more...