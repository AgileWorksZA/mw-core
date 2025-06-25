#!/bin/bash

# Build the CLI
echo "Building MoneyWorks CLI..."
bun build src/index.ts --compile --outfile mw

# Create bin directory if it doesn't exist
mkdir -p ~/.local/bin

# Copy to local bin
cp mw ~/.local/bin/

# Make executable
chmod +x ~/.local/bin/mw

echo "MoneyWorks CLI installed to ~/.local/bin/mw"
echo ""
echo "Make sure ~/.local/bin is in your PATH:"
echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
echo ""
echo "You can now use 'mw' command from anywhere!"