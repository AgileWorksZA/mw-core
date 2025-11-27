# MoneyWorks DataCenter Snitch

This tool creates a TCP proxy that sits between MoneyWorks clients and the DataCenter server, logging all traffic for debugging and analysis purposes.

## How It Works

1. The proxy listens on port 6710 (configurable)
2. It forwards all traffic to the actual DataCenter server on port 6711 (configurable)
3. All traffic in both directions is logged to files in the `logs` directory
4. Traffic is displayed in both hexadecimal and text format

## Usage

1. Configure your MoneyWorks DataCenter to run on port 6711 instead of the default 6710
2. Start the snitch proxy:
   ```
   bun run snitch
   ```
3. Connect your MoneyWorks clients to port 6710 (the proxy port)
4. All traffic will be logged to the `logs` directory

## Configuration

You can modify these values in the `snitch.ts` file:

- `PROXY_PORT`: The port the proxy listens on (default: 6710)
- `TARGET_PORT`: The port of the actual DataCenter server (default: 6711)
- `TARGET_HOST`: The hostname of the actual DataCenter server (default: 'localhost')
- `LOG_DIR`: Where to store log files (default: './logs')
- `MAX_LOG_SIZE`: Maximum log file size before rotation (default: 100MB)

## Log Format

Each log entry includes:
- Timestamp
- Direction (CLIENT_TO_SERVER or SERVER_TO_CLIENT)
- Data in hexadecimal format
- Data as text (if readable)

Example:
```
[2025-03-25T12:34:56.789Z] CLIENT_TO_SERVER
HEX: 48 65 6c 6c 6f 20 57 6f 72 6c 64
TEXT: Hello World
================================================================================
```

## Troubleshooting

- If you see "Port 6710 is already in use", make sure no other process is using that port
- If connections fail, verify that your DataCenter is running on the target port
- Check the console output for any error messages