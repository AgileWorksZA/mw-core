# MoneyWorks CLI

A command-line interface for testing MoneyWorks Core functionality.

## Installation

```bash
# Install dependencies
bun install

# Build the CLI
bun run build
```

## Configuration

Create a `mw-config.json` file:

```json
{
  "host": "localhost",
  "port": 6710,
  "username": "Admin",
  "password": "your-password",
  "dataFile": "Acme Widgets"
}
```

Or use environment variables:
- `MW_HOST`
- `MW_PORT`
- `MW_USERNAME`
- `MW_PASSWORD`
- `MW_DATAFILE`

## Usage

### Test Connection

```bash
bun run dev test-connection
# or with built binary
./mw test-connection
```

### Export Data

```bash
# Export all accounts as JSON (default)
bun run dev export Account

# Export as XML (verbose format with all fields)
bun run dev export Account --format xml-verbose

# Export as XML (terse/compact format)
bun run dev export Account --format xml-terse

# Export as Tab-Separated Values
bun run dev export Account --format tsv

# Export with filter
bun run dev export Account --filter "Type=1"

# Export first 10 transactions
bun run dev export Transaction --limit 10

# Export to file
bun run dev export Account --output accounts.json
bun run dev export Account --format xml-verbose --output accounts.xml
bun run dev export Account --format tsv --output accounts.tsv

# Use shell redirection
bun run dev export Product --format xml-terse > products.xml

# Stream large datasets (JSON only)
bun run dev export Transaction --stream
```

#### Supported Export Formats

- **json** - JSON format (default)
- **xml-verbose** - Detailed XML with all fields
- **xml-terse** - Compact XML format
- **tsv** - Tab-separated values

### Import Data

```bash
# Import accounts from JSON file
bun run dev import Account accounts.json

# Import with update mode
bun run dev import Account accounts.json --mode update

# Import with workItOut flag
bun run dev import Account accounts.json --workItOut
```

### Evaluate Expressions

```bash
# Count records
bun run dev eval "Count(Account)"

# Get account balance
bun run dev eval "Account.Balance[Code=\"1200\"]"

# Complex calculations
bun run dev eval "Sum(Transaction.Gross, Type=1)"
```

### Other Commands

```bash
# Get server version
bun run dev version

# List available documents
bun run dev list
```

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

```bash
# Run in development mode
bun run dev <command>

# Run with debug output
bun run dev <command> --debug
```