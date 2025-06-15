# CLI Timing Feature

The MoneyWorks CLI now includes a `--timing` (or `-t`) flag to measure command execution time.

## Usage

Add the `--timing` or `-t` flag to any command:

```bash
# Long form
./mw -c ./mw-config.json --timing export Transaction --limit 10

# Short form  
./mw -c ./mw-config.json -t export Transaction --limit 10
```

## Output

The timing information is written to stderr, so it doesn't interfere with the command's stdout output:

```
[Timing] Starting command: export
[Timing] Export API call: 614.44ms
[Timing] Output processing: 0.18ms
[Timing] Records processed: 10
[Timing] Command completed in 618.54ms (0.619s)
```

## Available for All Commands

The timing flag works with all CLI commands:

### Export Command
```bash
./mw -c ./mw-config.json -t export Account --limit 50
```
Shows:
- Export API call duration
- Output processing time
- Number of records processed (for JSON)
- Output size in KB (for other formats)

### Eval Command
```bash
./mw -c ./mw-config.json -t eval "1+1"
```
Shows:
- Evaluation duration

### Other Commands
All commands show:
- Total execution time
- Command name
- Success/failure status

## Debug Mode

Combine with `--debug` for more detailed timing breakdown:

```bash
./mw -c ./mw-config.json -t -d export Transaction --limit 5
```

This shows additional information:
- Command arguments
- Detailed breakdown of execution phases

## Performance Insights

Use the timing flag to:
- Compare performance of different export formats
- Measure impact of filters on query time
- Identify slow operations
- Optimize batch sizes for streaming

Example performance comparison:

```bash
# JSON format (includes parsing)
./mw -c ./mw-config.json -t export Transaction --limit 100 --format json
# Output: ~600ms

# TSV format (raw data)
./mw -c ./mw-config.json -t export Transaction --limit 100 --format tsv  
# Output: ~150ms

# Custom format with calculations
./mw -c ./mw-config.json -t export Transaction --limit 100 --format "[OurRef] - [Gross * 0.15]"
# Output: ~700ms
```

## Implementation Details

- Uses `performance.now()` for high-resolution timing
- Timing information is written to stderr
- No performance overhead when flag is not used
- Measures end-to-end execution time including all I/O operations