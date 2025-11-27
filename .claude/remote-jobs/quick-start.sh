#!/bin/bash

# MoneyWorks Gold Mapping - Quick Start Script
# Run this after cloning the repo and setting up mw-config.json

set -e

echo "🚀 MoneyWorks Gold Mapping - Quick Start"
echo "========================================="

# Create results directory
mkdir -p .claude/remote-jobs/results
mkdir -p /tmp/mw-screenshots

# Check dependencies
echo ""
echo "📋 Checking dependencies..."

if ! command -v bun &> /dev/null; then
    echo "❌ Bun not installed. Install with: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi
echo "✅ Bun installed"

if command -v cliclick &> /dev/null; then
    echo "✅ cliclick installed"
else
    echo "⚠️  cliclick not installed (optional). Install with: brew install cliclick"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
bun install

# Check MoneyWorks Gold
echo ""
echo "🔍 Checking MoneyWorks Gold..."
if bun packages/cli/src/index.ts gold status 2>/dev/null | grep -q "is running"; then
    echo "✅ MoneyWorks Gold is running"
    bun packages/cli/src/index.ts gold window
else
    echo "❌ MoneyWorks Gold is not running!"
    echo "   Please start MoneyWorks Gold and open the acme.moneyworks file"
    exit 1
fi

# Check REST API
echo ""
echo "🔌 Checking REST API..."
if [ -f "mw-config.json" ]; then
    if bun packages/cli/src/index.ts test-connection 2>/dev/null; then
        echo "✅ REST API connected"
    else
        echo "⚠️  REST API not responding. Check mw-config.json"
    fi
else
    echo "⚠️  mw-config.json not found. Create it for REST API access."
fi

# Take initial screenshot
echo ""
echo "📸 Taking initial screenshot..."
bun packages/cli/src/index.ts gold screenshot -o /tmp/mw-screenshots/00-initial.png
echo "✅ Screenshot saved to /tmp/mw-screenshots/00-initial.png"

echo ""
echo "========================================="
echo "✅ Ready to start mapping!"
echo ""
echo "Next steps:"
echo "1. Read .claude/remote-jobs/MW-GOLD-MAPPING-JOB.md for full instructions"
echo "2. Read .claude/remote-jobs/PRIOR-DISCOVERIES.md for what's already known"
echo "3. Start with Phase 1: Keyboard shortcut mapping"
echo ""
echo "Quick commands:"
echo "  bun packages/cli/src/index.ts gold status"
echo "  bun packages/cli/src/index.ts gold screenshot -o /tmp/mw-screenshots/test.png"
echo "  bun packages/cli/src/index.ts gold menu \"Show/Transactions\""
echo "  bun packages/cli/src/index.ts gold key \"cmd+1\""
echo ""
