#!/bin/bash

echo "Installing dependencies for MoneyWorks monorepo..."

# Install root dependencies
echo "Installing root dependencies..."
bun install

# Install MCP server dependencies specifically
echo "Installing MCP server dependencies..."
cd packages/mcp-server
bun install

echo "Done! Dependencies installed."