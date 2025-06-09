#!/bin/bash

# MoneyWorks Documentation Mirror Status Checker
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIRROR_DIR="$BASE_DIR/mirror"
LOG_DIR="$BASE_DIR/logs"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== MoneyWorks Mirror Status ===${NC}"
echo -e "Time: $(date)"
echo

# Check if HTTrack is running
if pgrep -f "httrack.*cognito.co.nz" > /dev/null; then
    echo -e "${YELLOW}🔄 HTTrack is running${NC}"
    
    # Get latest log file
    LATEST_LOG=$(ls -t $LOG_DIR/httrack_*.log 2>/dev/null | head -1)
    if [ -f "$LATEST_LOG" ]; then
        echo -e "Latest log: $(basename "$LATEST_LOG")"
        echo -e "${BLUE}Progress:${NC}"
        tail -3 "$LATEST_LOG" | grep -E "(Current job|Transfer rate|Bytes saved)" || echo "Parsing log..."
    fi
else
    echo -e "${GREEN}✅ HTTrack has completed${NC}"
fi

echo

# Check mirror status
echo -e "${BLUE}=== Mirror Contents ===${NC}"
if [ -d "$MIRROR_DIR" ]; then
    echo -e "Mirror size: $(du -sh "$MIRROR_DIR" 2>/dev/null | cut -f1)"
    echo -e "HTML files: $(find "$MIRROR_DIR" -name "*.html" 2>/dev/null | wc -l)"
    echo
    
    # Check for critical appendix files
    echo -e "${BLUE}Critical appendix files:${NC}"
    critical_files=(
        "moneyworks_appendix_names.html"
        "moneyworks_appendix_accounts.html"
        "moneyworks_appendix_transactions.html"
        "moneyworks_appendix_products.html"
    )
    
    for file in "${critical_files[@]}"; do
        if find "$MIRROR_DIR" -name "*$file*" | grep -q .; then
            echo -e "${GREEN}✅ $file${NC}"
        else
            echo -e "${RED}❌ $file${NC}"
        fi
    done
    
    echo
    echo -e "${BLUE}All appendix files found:${NC}"
    find "$MIRROR_DIR" -name "*appendix*.html" 2>/dev/null | sort | while read -r file; do
        echo -e "📄 $(basename "$file")"
    done
    
else
    echo -e "${RED}❌ Mirror directory not found${NC}"
fi

echo
echo -e "${BLUE}=== Next Steps ===${NC}"

# Check readiness for entity generation
appendix_count=$(find "$MIRROR_DIR" -name "*appendix*.html" 2>/dev/null | wc -l)
if [ "$appendix_count" -ge 4 ]; then
    echo -e "${GREEN}✅ Ready for parallel entity generation${NC}"
    echo -e "Available entities:"
    echo -e "  - Account (ready for generation)"
    echo -e "  - Transaction (ready for generation)"
    echo -e "  - Product (ready for generation)"
    echo -e "  - Others (based on available appendix files)"
elif [ "$appendix_count" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Partial mirror available${NC}"
    echo -e "Can start generation for entities with available docs"
else
    echo -e "${YELLOW}⏳ Waiting for appendix files...${NC}"
    echo -e "Continue monitoring or proceed with existing knowledge"
fi

echo
echo -e "${BLUE}Command options:${NC}"
echo -e "  ./scripts/check-mirror-status.sh  # Run this script again"
echo -e "  watch -n 30 ./scripts/check-mirror-status.sh  # Auto-refresh every 30 seconds"
echo -e "  # Start Account entity generation while waiting" 