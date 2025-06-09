#!/bin/bash

# Prepare Claude Instance Deployment Packages
# Creates single files with all context needed for each parallel Claude instance

set -e

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_DIR="$BASE_DIR/claude-deployments"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Preparing Claude Deployment Packages ===${NC}"
echo

# Create deployment directory
mkdir -p "$DEPLOY_DIR"

echo -e "${YELLOW}Creating deployment packages...${NC}"

# Function to create a deployment package
create_deployment_package() {
    local entity=$1
    local claude_num=$2
    local assignment_file=$3
    local source_file=$4
    
    local package_file="$DEPLOY_DIR/CLAUDE-${claude_num}-${entity}-DEPLOYMENT.md"
    
    echo -e "📦 Creating package for Claude-${claude_num}: ${entity}"
    
    cat > "$package_file" << EOF
# Claude-${claude_num} Deployment Package: ${entity} Entity Generation

## 🎯 Your Mission
You are Claude-${claude_num} in a parallel processing team generating MoneyWorks entities.
Generate a complete semantic TypeScript definition for the **${entity}** entity.

## 📋 Complete Assignment
$(cat "$BASE_DIR/$assignment_file")

## 📖 Reference Implementation (Your Template)
Study this complete Name entity implementation as your pattern:

\`\`\`typescript
$(cat "$BASE_DIR/generated/name.ts")
\`\`\`

## 📁 Source API Definition
Use this as your primary source for field definitions:

\`\`\`typescript
$(cat "$BASE_DIR/$source_file")
\`\`\`

## 🏗️ Current Entity Mappings Structure
Update this structure when you complete your entity:

\`\`\`yaml
$(cat "$BASE_DIR/entity-mappings.yaml")
\`\`\`

## ✅ Success Criteria Checklist
Before submitting your work, verify:

- [ ] Created \`generated/${entity,,}.ts\` following Name entity pattern exactly
- [ ] All fields from source API definition included
- [ ] Semantic enums for all constrained fields (no magic numbers)
- [ ] Complete JSDoc documentation for every field
- [ ] Validation functions with proper constraints
- [ ] Query builder class for type-safe queries
- [ ] Utility functions for business logic
- [ ] TypeScript compiles without errors
- [ ] Updated entity-mappings.yaml with your entity

## 🚀 Begin Immediately
Start working on the ${entity} entity now. Follow the Name entity pattern exactly.
Deliver your completed files when ready for integration review.

## 📞 Questions?
Add TODO comments in your generated file for any ambiguities.
Primary Claude will review and integrate your work.
EOF

    echo -e "   → $package_file"
}

# Create deployment packages
create_deployment_package "Transaction" "2" "docs/claude-assignments/CLAUDE-2-ASSIGNMENT.md" "packages/api/src/types/interface/tables/transaction.ts"
create_deployment_package "Product" "3" "docs/claude-assignments/CLAUDE-3-ASSIGNMENT.md" "packages/api/src/types/interface/tables/product.ts"  
create_deployment_package "Ledger" "4" "docs/claude-assignments/CLAUDE-4-ASSIGNMENT.md" "packages/api/src/types/interface/tables/ledger.ts"

echo
echo -e "${GREEN}✅ Deployment packages created!${NC}"
echo
echo -e "${BLUE}Deployment files ready:${NC}"
ls -la "$DEPLOY_DIR"/*.md | while read -r line; do
    echo -e "  📦 $(basename $(echo $line | awk '{print $9}'))"
done

echo
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Check your Claude account limits"
echo -e "2. Open 3 new Claude conversations"
echo -e "3. Copy/paste one deployment file per conversation:"
echo -e "   • Conversation 1: $(basename "$DEPLOY_DIR/CLAUDE-2-Transaction-DEPLOYMENT.md")"
echo -e "   • Conversation 2: $(basename "$DEPLOY_DIR/CLAUDE-3-Product-DEPLOYMENT.md")"  
echo -e "   • Conversation 3: $(basename "$DEPLOY_DIR/CLAUDE-4-Ledger-DEPLOYMENT.md")"
echo -e "4. Each Claude will work independently for 2-3 hours"
echo -e "5. Primary Claude will review and integrate results"

echo
echo -e "${GREEN}🚀 Ready for parallel deployment!${NC}" 