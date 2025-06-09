#!/bin/bash

set -e  # Exit on any error

echo "🚀 MoneyWorks Entity Generation - Parallel Claude Code Deployment"
echo "Time: $(date)"
echo "Working Directory: $(pwd)"
echo ""

# Function to setup Node.js environment
setup_nodejs() {
    echo "🔧 Setting up Node.js environment..."
    
    # Add bun to PATH if it exists
    if [ -d "$HOME/.bun/bin" ]; then
        export PATH="$HOME/.bun/bin:$PATH"
        echo "✅ Added bun to PATH"
    fi
    
    # Check if node is available
    if command -v node &> /dev/null; then
        echo "✅ Node.js $(node --version) found"
    else
        echo "⚠️  Node.js not found in PATH, but bunx should handle this"
    fi
    
    echo ""
}

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    
    # Check if bunx command exists
    if ! command -v bunx &> /dev/null; then
        echo "❌ bunx (Bun) not found. Please install Bun first."
        exit 1
    fi
    
    # Test Claude Code via bunx
    echo "🧪 Testing Claude Code access..."
    if bunx @anthropic-ai/claude-code@latest --version &> /dev/null; then
        local version=$(bunx @anthropic-ai/claude-code@latest --version 2>/dev/null | tail -1)
        echo "✅ Claude Code accessible via bunx: $version"
    else
        echo "❌ Claude Code not accessible via bunx"
        exit 1
    fi
    
    # Check deployment files
    local missing_files=()
    local deployment_files=(
        "claude-deployments/CLAUDE-2-Transaction-DEPLOYMENT-FINAL.md"
        "claude-deployments/CLAUDE-3-Product-DEPLOYMENT-FINAL.md"
        "claude-deployments/CLAUDE-4-Ledger-DEPLOYMENT-FINAL.md"
        "generated/name.ts"
    )
    
    for file in "${deployment_files[@]}"; do
        if [ ! -f "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -ne 0 ]; then
        echo "❌ Missing deployment files:"
        printf '%s\n' "${missing_files[@]}"
        exit 1
    fi
    
    echo "✅ All deployment files found"
    echo ""
}

# Function to create directories
setup_directories() {
    echo "📁 Setting up directories..."
    mkdir -p generated logs
    echo "✅ Directories ready"
    echo ""
}

# Function to run a single entity generation
generate_entity() {
    local entity_name="$1"
    local deployment_file="$2"
    local output_file="$3"
    local log_file="logs/${entity_name}-generation.log"
    
    echo "🔄 Starting $entity_name entity generation..."
    echo "   📋 Input: $deployment_file"
    echo "   📝 Output: $output_file"
    echo "   📊 Log: $log_file"
    
    # Read the deployment file content and pass it as a prompt
    if [ -f "$deployment_file" ]; then
        {
            echo "=== $entity_name Entity Generation Started at $(date) ==="
            echo ""
            
            # Set up environment for Claude Code
            export PATH="$HOME/.bun/bin:$PATH"
            
            # Run Claude Code with the deployment file content as prompt
            bunx @anthropic-ai/claude-code@latest -p "$(cat "$deployment_file")" --output-format text 2>&1
            
            echo ""
            echo "=== $entity_name Entity Generation Completed at $(date) ==="
        } > "$log_file" 2>&1 &
        
        # Store the background process ID
        local pid=$!
        echo "$pid" > "logs/${entity_name}.pid"
        echo "   🆔 Process ID: $pid"
        echo ""
        
        return 0
    else
        echo "❌ Deployment file not found: $deployment_file"
        return 1
    fi
}

# Function to extract TypeScript code from log and save to file
extract_typescript() {
    local entity_name="$1"
    local log_file="logs/${entity_name}-generation.log"
    local output_file="$2"
    
    echo "📄 Extracting TypeScript from $entity_name log..."
    
    if [ -f "$log_file" ]; then
        # Look for TypeScript code blocks in the log and extract the largest one
        awk '
        /^```typescript/ { in_ts = 1; ts_content = ""; next }
        /^```/ && in_ts { 
            in_ts = 0; 
            if (length(ts_content) > length(best_content)) {
                best_content = ts_content
            }
            next 
        }
        in_ts { ts_content = ts_content $0 "\n" }
        END { if (best_content) print best_content }
        ' "$log_file" > "$output_file"
        
        if [ -s "$output_file" ]; then
            local line_count=$(wc -l < "$output_file")
            echo "✅ Extracted $line_count lines to $output_file"
            return 0
        else
            echo "⚠️  No TypeScript code found in log"
            return 1
        fi
    else
        echo "❌ Log file not found: $log_file"
        return 1
    fi
}

# Function to monitor running processes
monitor_processes() {
    echo "👀 Monitoring entity generation processes..."
    echo ""
    
    local entities=("Transaction" "Product" "Ledger")
    local completed=()
    local failed=()
    
    while [ ${#completed[@]} -lt ${#entities[@]} ]; do
        echo "📊 Status check at $(date):"
        
        for entity in "${entities[@]}"; do
            local pid_file="logs/${entity}.pid"
            local log_file="logs/${entity}-generation.log"
            
            # Skip if already completed or failed
            if [[ " ${completed[@]} " =~ " ${entity} " ]] || [[ " ${failed[@]} " =~ " ${entity} " ]]; then
                continue
            fi
            
            if [ -f "$pid_file" ]; then
                local pid=$(cat "$pid_file")
                
                if kill -0 "$pid" 2>/dev/null; then
                    # Process is still running
                    local log_size=0
                    [ -f "$log_file" ] && log_size=$(wc -l < "$log_file")
                    echo "  🔄 $entity: Running (PID: $pid, Log lines: $log_size)"
                else
                    # Process has finished
                    local exit_code=0
                    wait "$pid" 2>/dev/null || exit_code=$?
                    
                    if [ $exit_code -eq 0 ]; then
                        echo "  ✅ $entity: Completed"
                        completed+=("$entity")
                        
                        # Extract TypeScript code
                        local output_file="generated/${entity,,}.ts"
                        extract_typescript "$entity" "$output_file"
                    else
                        echo "  ❌ $entity: Failed (exit code: $exit_code)"
                        failed+=("$entity")
                    fi
                    
                    rm -f "$pid_file"
                fi
            fi
        done
        
        echo "  📈 Progress: ${#completed[@]}/${#entities[@]} completed, ${#failed[@]} failed"
        echo ""
        
        # Wait before next check
        sleep 30
    done
    
    echo "🎯 All processes completed!"
    echo "✅ Completed: ${completed[*]}"
    [ ${#failed[@]} -gt 0 ] && echo "❌ Failed: ${failed[*]}"
    echo ""
}

# Function to validate generated files
validate_results() {
    echo "✅ Validating generated files..."
    
    local entities=("name" "transaction" "product" "ledger")
    local valid_files=0
    
    for entity in "${entities[@]}"; do
        local file="generated/${entity}.ts"
        
        if [ -f "$file" ]; then
            local lines=$(wc -l < "$file")
            local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
            
            if [ "$lines" -gt 50 ] && [ "$size" -gt 1000 ]; then
                echo "  ✅ $entity.ts: $lines lines, ${size} bytes"
                ((valid_files++))
            else
                echo "  ⚠️  $entity.ts: Too small ($lines lines, ${size} bytes)"
            fi
        else
            echo "  ❌ $entity.ts: Missing"
        fi
    done
    
    echo ""
    echo "📊 Validation Summary: $valid_files/${#entities[@]} valid files"
    
    if [ $valid_files -eq ${#entities[@]} ]; then
        echo "🎉 All entity files generated successfully!"
        return 0
    else
        echo "⚠️  Some entity files are missing or incomplete"
        return 1
    fi
}

# Function to show final summary
show_summary() {
    echo ""
    echo "==============================================================="
    echo "🎯 MoneyWorks Entity Generation Summary"
    echo "==============================================================="
    echo ""
    echo "📁 Generated files:"
    ls -la generated/*.ts 2>/dev/null || echo "  No TypeScript files found"
    echo ""
    echo "📊 Log files:"
    ls -la logs/*.log 2>/dev/null || echo "  No log files found"
    echo ""
    echo "🔄 Next steps:"
    echo "  1. Review generated TypeScript files in generated/"
    echo "  2. Check logs/ for any generation issues"
    echo "  3. Test TypeScript compilation"
    echo "  4. Integrate into your MoneyWorks API"
    echo ""
    echo "==============================================================="
}

# Main execution
main() {
    setup_nodejs
    check_prerequisites
    setup_directories
    
    echo "🚀 Starting parallel entity generation..."
    echo ""
    
    # Start all entity generations in parallel
    generate_entity "Transaction" "claude-deployments/CLAUDE-2-Transaction-DEPLOYMENT-FINAL.md" "generated/transaction.ts"
    generate_entity "Product" "claude-deployments/CLAUDE-3-Product-DEPLOYMENT-FINAL.md" "generated/product.ts"
    generate_entity "Ledger" "claude-deployments/CLAUDE-4-Ledger-DEPLOYMENT-FINAL.md" "generated/ledger.ts"
    
    echo "🔄 All entity generations started in parallel!"
    echo ""
    
    # Monitor progress
    monitor_processes
    
    # Validate results
    validate_results
    
    # Show summary
    show_summary
}

# Handle interruption
trap 'echo ""; echo "🛑 Deployment interrupted. Cleaning up..."; kill $(jobs -p) 2>/dev/null; exit 1' INT TERM

# Run main function
main "$@" 