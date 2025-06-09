#!/bin/bash

echo "=== MoneyWorks Entity Generation - Parallel Claude Deployment ==="
echo "Time: $(date)"

# Function to check if files exist
check_deployment_files() {
    echo ""
    echo "🔍 Checking deployment files..."
    
    local files_ready=0
    local files_total=4
    
    for file in \
        "claude-deployments/CLAUDE-2-Transaction-DEPLOYMENT-FINAL.md" \
        "claude-deployments/CLAUDE-3-Product-DEPLOYMENT-FINAL.md" \
        "claude-deployments/CLAUDE-4-Ledger-DEPLOYMENT-FINAL.md" \
        "generated/name.ts"
    do
        if [ -f "$file" ]; then
            echo "✅ $file"
            ((files_ready++))
        else
            echo "❌ $file (missing)"
        fi
    done
    
    echo ""
    echo "📊 Deployment files: $files_ready/$files_total ready"
    
    if [ $files_ready -eq $files_total ]; then
        echo "🎯 All deployment files ready!"
        return 0
    else
        echo "⚠️  Some deployment files missing"
        return 1
    fi
}

# Function to check MoneyWorks documentation access
check_documentation_access() {
    echo ""
    echo "📚 MoneyWorks Documentation Access:"
    echo "Primary URL: https://cognito.co.nz/manual/moneyworks_appendix_appendix_afield_descriptions.html"
    echo "Each Claude instance will use web_search to access this documentation"
    echo ""
}

# Function to create entity generation directories
setup_directories() {
    echo ""
    echo "📁 Setting up directories..."
    
    mkdir -p generated
    mkdir -p claude-deployments
    mkdir -p logs
    
    echo "✅ Directories ready"
}

# Function to display deployment instructions
show_deployment_instructions() {
    echo ""
    echo "🚀 PARALLEL DEPLOYMENT INSTRUCTIONS:"
    echo ""
    echo "1. **Check your Claude account limits** (need 3 additional conversations)"
    echo ""
    echo "2. **Open 3 new Claude conversations** and paste these deployment packages:"
    echo ""
    echo "   📋 **Claude-2 (Transaction):**"
    echo "   Copy: claude-deployments/CLAUDE-2-Transaction-DEPLOYMENT-FINAL.md"
    echo "   Expected output: generated/transaction.ts"
    echo ""
    echo "   📋 **Claude-3 (Product):**" 
    echo "   Copy: claude-deployments/CLAUDE-3-Product-DEPLOYMENT-FINAL.md"
    echo "   Expected output: generated/product.ts"
    echo ""
    echo "   📋 **Claude-4 (Ledger):**"
    echo "   Copy: claude-deployments/CLAUDE-4-Ledger-DEPLOYMENT-FINAL.md"
    echo "   Expected output: generated/ledger.ts"
    echo ""
    echo "3. **Monitor progress** - Each Claude will:"
    echo "   • Use web_search to access official MoneyWorks documentation"
    echo "   • Find their entity's field descriptions and enum values"
    echo "   • Generate complete semantic TypeScript following Name pattern"
    echo "   • Use only documented values (no guessing)"
    echo ""
    echo "4. **Expected timeline:** 2-3 hours per entity"
    echo ""
    echo "5. **Final result:** 5 entities complete (Name✅ + Transaction + Product + Ledger + Account)"
    echo ""
}

# Function to show current progress
show_progress() {
    echo ""
    echo "📈 CURRENT PROGRESS:"
    echo ""
    echo "🎯 **Entities Prioritized:** 33 total discovered"
    echo "✅ **Infrastructure Complete:** HTTrack mirroring, parallel framework"
    echo "✅ **Reference Implementation:** Name entity (543 lines)"
    echo "✅ **Documentation Access:** Official MoneyWorks appendix found"
    echo "✅ **Deployment Packages:** 3 comprehensive packages ready"
    echo ""
    echo "🔄 **Ready for Parallel Processing:**"
    echo "   - Name ✅ (Complete)"
    echo "   - Transaction 🔄 (Ready for Claude-2)"
    echo "   - Product 🔄 (Ready for Claude-3)"
    echo "   - Ledger 🔄 (Ready for Claude-4)"
    echo "   - Account 🔄 (Primary Claude)"
    echo ""
    echo "📊 **Expected Coverage:** 5/33 entities (15% - all critical entities)"
}

# Main execution
main() {
    echo ""
    setup_directories
    check_deployment_files
    check_documentation_access
    show_progress
    show_deployment_instructions
    
    echo ""
    echo "==============================================================="
    echo "🎯 **Next Step:** Copy deployment packages to 3 new Claude conversations"
    echo "📞 **Questions?** Each package includes complete instructions"
    echo "🔄 **Status:** Ready for parallel entity generation"
    echo "==============================================================="
    echo ""
}

# Run main function
main 