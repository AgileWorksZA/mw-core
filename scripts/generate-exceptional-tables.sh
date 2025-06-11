#!/bin/bash

# Script to generate TypeScript interfaces for MoneyWorks exceptional tables
# These tables were discovered outside the initial context

echo "🚀 Generating TypeScript interfaces for MoneyWorks exceptional tables..."
echo ""

# List of exceptional tables
EXCEPTIONAL_TABLES=(
  "login"
  "user"
  "user2"
  "payments"
  "offledger"
  "memo"
  "asset-log"
  "asset-categories"
  "build"
  "auto-split"
  "reconciliation"
  "general"
)

# Counter for tracking progress
SUCCESS_COUNT=0
FAIL_COUNT=0

echo "📋 Tables to generate: ${#EXCEPTIONAL_TABLES[@]}"
echo ""

# Generate each table
for table in "${EXCEPTIONAL_TABLES[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Processing: $table"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  # Run the generation command
  if /project:mw-generate-table-types table="$table"; then
    echo "✅ Successfully generated: $table"
    ((SUCCESS_COUNT++))
  else
    echo "❌ Failed to generate: $table"
    ((FAIL_COUNT++))
  fi
  
  echo ""
  
  # Small delay to avoid overwhelming the system
  sleep 1
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Generation Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Successfully generated: $SUCCESS_COUNT tables"
echo "❌ Failed: $FAIL_COUNT tables"
echo ""

# Post-generation reminders
echo "📌 Post-Generation Tasks:"
echo "1. Review generated interfaces in packages/core/src/tables/"
echo "2. Create helper utilities for:"
echo "   - Password encryption (Login table)"
echo "   - Overpayment bit handling (Payments table)"
echo "   - Code prefix discrimination (General table)"
echo "   - Array size handling (OffLedger table)"
echo "3. Update index.ts to export new table types"
echo "4. Run 'bun run typecheck' to verify types"
echo "5. Document special access patterns (e.g., AssetLog via Assets)"
echo ""
echo "📚 Documentation:"
echo "- Exceptional tables guide: docs/moneyworks-exceptional-tables-guide.md"
echo "- Full analysis: docs/moneyworks-additional-tables-analysis.md"