#!/bin/bash

# MoneyWorks Documentation Mirroring Script
# Uses HTTrack to create a local mirror of MoneyWorks documentation

set -e  # Exit on error

# Configuration
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIRROR_DIR="$BASE_DIR/mirror"
LOG_DIR="$BASE_DIR/logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== MoneyWorks Documentation Mirroring ===${NC}"
echo -e "Timestamp: $TIMESTAMP"
echo -e "Base Directory: $BASE_DIR"
echo -e "Mirror Directory: $MIRROR_DIR"
echo

# Create directories
echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p "$MIRROR_DIR"
mkdir -p "$LOG_DIR"
mkdir -p "$MIRROR_DIR/manual"
mkdir -p "$MIRROR_DIR/developer"

# Check if httrack is installed
if ! command -v httrack &> /dev/null; then
    echo -e "${RED}ERROR: httrack is not installed${NC}"
    echo "Please install httrack:"
    echo "  macOS: brew install httrack"
    echo "  Ubuntu: sudo apt-get install httrack"
    exit 1
fi

echo -e "${GREEN}httrack found: $(which httrack)${NC}"
echo

# Function to mirror a site section
mirror_section() {
    local section=$1
    local base_url=$2
    local output_dir=$3
    local log_file="$LOG_DIR/httrack_${section}_${TIMESTAMP}.log"
    
    echo -e "${YELLOW}Mirroring $section from $base_url...${NC}"
    echo -e "Output: $output_dir"
    echo -e "Log: $log_file"
    
    # HTTrack options:
    # -O: output directory
    # -v: verbose
    # -s0: no size limit
    # -r5: depth 5 levels
    # -%v: verbose mode
    # -N100: max connections
    # -c4: cache settings
    # -%s: display 
    # -A25000: user-agent
    # -%h: check document type
    
    httrack "$base_url" \
        -O "$output_dir" \
        -v \
        -s0 \
        -r5 \
        -%v \
        -N100 \
        -c4 \
        -%s \
        -A25000 \
        -%h \
        -%P \
        -j \
        -%e0 \
        --max-rate=100000 \
        --sockets=4 \
        --keep-alive \
        --robots=0 \
        --footer="" \
        -%x \
        -F "Mozilla/5.0 (compatible; MoneyWorks-Mirror/1.0)" \
        > "$log_file" 2>&1
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ $section mirroring completed successfully${NC}"
    else
        echo -e "${RED}❌ $section mirroring failed with exit code $exit_code${NC}"
        echo -e "Check log file: $log_file"
        return $exit_code
    fi
}

# Function to validate mirror
validate_mirror() {
    local section=$1
    local mirror_path=$2
    local expected_files=("$@")
    shift 2  # Remove first two arguments, rest are expected files
    
    echo -e "${YELLOW}Validating $section mirror...${NC}"
    
    if [ ! -d "$mirror_path" ]; then
        echo -e "${RED}❌ Mirror directory not found: $mirror_path${NC}"
        return 1
    fi
    
    local file_count=$(find "$mirror_path" -name "*.html" | wc -l)
    echo -e "Found $file_count HTML files"
    
    # Check for specific expected files
    local missing_files=()
    for expected_file in "${expected_files[@]}"; do
        if ! find "$mirror_path" -name "*$expected_file*" | grep -q .; then
            missing_files+=("$expected_file")
        fi
    done
    
    if [ ${#missing_files[@]} -eq 0 ]; then
        echo -e "${GREEN}✅ All expected files found${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Missing files:${NC}"
        for missing in "${missing_files[@]}"; do
            echo -e "  - $missing"
        done
        return 1
    fi
}

# Function to list found appendix files
list_appendix_files() {
    local mirror_path=$1
    echo -e "${BLUE}Appendix files found:${NC}"
    find "$mirror_path" -name "*appendix*.html" | sort | while read -r file; do
        echo -e "  📄 $(basename "$file")"
    done
}

# Start mirroring
echo -e "${BLUE}Starting documentation mirroring...${NC}"
echo

# Mirror Manual Section
echo -e "${BLUE}=== Mirroring Manual Section ===${NC}"
if mirror_section "manual" "https://cognito.co.nz/manual/" "$MIRROR_DIR/manual"; then
    # Validate manual mirror
    expected_manual_files=(
        "moneyworks_appendix_names.html"
        "moneyworks_appendix_accounts.html" 
        "moneyworks_appendix_transactions.html"
        "moneyworks_appendix_products.html"
        "index.html"
    )
    validate_mirror "manual" "$MIRROR_DIR/manual" "${expected_manual_files[@]}"
    list_appendix_files "$MIRROR_DIR/manual"
else
    echo -e "${RED}Manual mirroring failed${NC}"
fi

echo

# Mirror Developer Section  
echo -e "${BLUE}=== Mirroring Developer Section ===${NC}"
if mirror_section "developer" "https://cognito.co.nz/developer/" "$MIRROR_DIR/developer"; then
    # Validate developer mirror
    expected_dev_files=(
        "index.html"
        "api"
        "rest"
    )
    validate_mirror "developer" "$MIRROR_DIR/developer" "${expected_dev_files[@]}"
else
    echo -e "${RED}Developer mirroring failed${NC}"
fi

echo

# Generate mirror report
REPORT_FILE="$LOG_DIR/mirror_report_${TIMESTAMP}.txt"
echo -e "${BLUE}Generating mirror report...${NC}"

cat > "$REPORT_FILE" << EOF
MoneyWorks Documentation Mirror Report
Generated: $(date)

=== SUMMARY ===
Manual files: $(find "$MIRROR_DIR/manual" -name "*.html" 2>/dev/null | wc -l)
Developer files: $(find "$MIRROR_DIR/developer" -name "*.html" 2>/dev/null | wc -l)

=== MANUAL APPENDIX FILES ===
$(find "$MIRROR_DIR/manual" -name "*appendix*.html" 2>/dev/null | sort)

=== DEVELOPER API FILES ===  
$(find "$MIRROR_DIR/developer" -name "*api*.html" 2>/dev/null | sort)

=== DIRECTORY STRUCTURE ===
$(tree "$MIRROR_DIR" 2>/dev/null || find "$MIRROR_DIR" -type f | head -20)

=== TOTAL SIZE ===
$(du -sh "$MIRROR_DIR" 2>/dev/null)
EOF

echo -e "${GREEN}Mirror report saved to: $REPORT_FILE${NC}"

# Display summary
echo
echo -e "${BLUE}=== MIRRORING COMPLETE ===${NC}"
echo -e "Manual files: $(find "$MIRROR_DIR/manual" -name "*.html" 2>/dev/null | wc -l)"
echo -e "Developer files: $(find "$MIRROR_DIR/developer" -name "*.html" 2>/dev/null | wc -l)"
echo -e "Total size: $(du -sh "$MIRROR_DIR" 2>/dev/null | cut -f1)"
echo
echo -e "${GREEN}Next steps:${NC}"
echo -e "1. Review mirror report: $REPORT_FILE"
echo -e "2. Verify appendix files are present"
echo -e "3. Generate Account entity"
echo -e "4. Update entity-mappings.yaml"

echo
echo -e "${BLUE}=== MIRROR VALIDATION ===${NC}"

# Check if we have the critical files for entity generation
critical_files=(
    "moneyworks_appendix_names.html"
    "moneyworks_appendix_accounts.html"
    "moneyworks_appendix_transactions.html"
    "moneyworks_appendix_products.html"
)

missing_critical=()
for file in "${critical_files[@]}"; do
    if ! find "$MIRROR_DIR" -name "*$file*" | grep -q .; then
        missing_critical+=("$file")
    fi
done

if [ ${#missing_critical[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ All critical files for entity generation are present${NC}"
    echo -e "${GREEN}✅ Ready to proceed with Account entity generation${NC}"
else
    echo -e "${YELLOW}⚠️  Missing critical files:${NC}"
    for missing in "${missing_critical[@]}"; do
        echo -e "  - $missing"
    done
fi

echo -e "${BLUE}Mirror directory: $MIRROR_DIR${NC}"
echo -e "${BLUE}Log directory: $LOG_DIR${NC}" 