#!/bin/bash

set -e

echo "🚀 Launching Autonomous Transaction Entity Generation"
echo "Time: $(date)"
echo "Workspace: $(pwd)"

# Set up the workspace
echo "📁 Setting up workspace..."

# Ensure we're in the correct directory
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create initial files if they don't exist
if [ ! -f "tsconfig.json" ]; then
    echo "⚙️ Creating TypeScript config..."
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "include": ["*.ts"],
  "exclude": ["node_modules", "dist"]
}
EOF
fi

echo ""
echo "🎯 AUTONOMOUS MISSION: Generate MoneyWorks Transaction Entity"
echo ""
echo "📋 Success Criteria:"
echo "   ✅ Official MoneyWorks documentation accessed"
echo "   ✅ Complete TypeScript entity generated"
echo "   ✅ All validation tests pass"
echo "   ✅ Documentation sources recorded"
echo ""
echo "🔄 Process: Claude will iterate autonomously until all tests pass"
echo ""

# Launch Claude Code with master instructions
echo "🚀 Starting autonomous Claude instance..."
echo ""

# Check if this is a resumed session
if [ -f ".claude-session-id" ]; then
    echo "📄 Found existing session, resuming..."
    SESSION_ID=$(cat .claude-session-id)
    bunx @anthropic-ai/claude-code@latest --resume "$SESSION_ID"
else
    echo "🆕 Starting new autonomous session..."
    
    # Create the initial prompt
    INITIAL_PROMPT="
🎯 AUTONOMOUS TRANSACTION ENTITY GENERATION MISSION

You are working in an isolated workspace to autonomously generate a MoneyWorks Transaction entity.

CRITICAL: Read your complete instructions first:
$(cat MASTER-INSTRUCTIONS.md)

Your workspace is: $(pwd)

BEGIN AUTONOMOUS WORK:
1. Read MASTER-INSTRUCTIONS.md completely
2. Begin autonomous iteration loop  
3. Continue until ALL validation tests pass
4. Use session continuation (claude -c) to maintain context across iterations

Start now by reading your instructions and beginning the autonomous process.
"
    
    # Start Claude Code session
    echo "$INITIAL_PROMPT" | bunx @anthropic-ai/claude-code@latest
fi

echo ""
echo "🎯 Autonomous session completed!"
echo "📊 Check results in this workspace" 