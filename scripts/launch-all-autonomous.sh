#!/bin/bash

set -e

echo "🚀 MoneyWorks Autonomous Entity Generation - Master Launcher"
echo "Time: $(date)"
echo ""

# Function to create workspace if it doesn't exist
setup_workspace() {
    local entity="$1"
    local workspace="workspaces/claude-${entity}"
    
    echo "📁 Setting up ${entity} workspace..."
    
    if [ ! -d "$workspace" ]; then
        mkdir -p "$workspace"
    fi
    
    # Copy Transaction template files if they don't exist
    if [ ! -f "$workspace/MASTER-INSTRUCTIONS.md" ]; then
        echo "📋 Creating ${entity} instructions..."
        cp "workspaces/claude-transaction/MASTER-INSTRUCTIONS.md" "$workspace/"
        
        # Update entity-specific details
        sed -i.bak "s/Transaction/${entity^}/g" "$workspace/MASTER-INSTRUCTIONS.md"
        sed -i.bak "s/transaction/${entity}/g" "$workspace/MASTER-INSTRUCTIONS.md"
        rm "$workspace/MASTER-INSTRUCTIONS.md.bak"
    fi
    
    if [ ! -f "$workspace/package.json" ]; then
        echo "📦 Creating ${entity} package.json..."
        cp "workspaces/claude-transaction/package.json" "$workspace/"
        sed -i.bak "s/transaction/${entity}/g" "$workspace/package.json"
        rm "$workspace/package.json.bak"
    fi
    
    if [ ! -f "$workspace/launch-autonomous.sh" ]; then
        echo "🚀 Creating ${entity} launcher..."
        cp "workspaces/claude-transaction/launch-autonomous.sh" "$workspace/"
        sed -i.bak "s/Transaction/${entity^}/g" "$workspace/launch-autonomous.sh"
        sed -i.bak "s/transaction/${entity}/g" "$workspace/launch-autonomous.sh"
        chmod +x "$workspace/launch-autonomous.sh"
        rm "$workspace/launch-autonomous.sh.bak"
    fi
    
    echo "✅ ${entity^} workspace ready"
}

# Function to launch autonomous workspace
launch_workspace() {
    local entity="$1"
    local workspace="workspaces/claude-${entity}"
    
    echo ""
    echo "🚀 Launching autonomous ${entity^} generation..."
    echo "📁 Workspace: $workspace"
    
    # Start the autonomous process in background
    (
        cd "$workspace"
        echo "📍 Starting ${entity^} autonomous session..."
        ./launch-autonomous.sh
    ) &
    
    local pid=$!
    echo "🆔 ${entity^} Process ID: $pid"
    echo "$pid" > "$workspace/.autonomous-pid"
    
    return 0
}

# Function to check workspace status
check_workspace_status() {
    local entity="$1"
    local workspace="workspaces/claude-${entity}"
    
    if [ -f "$workspace/.autonomous-pid" ]; then
        local pid=$(cat "$workspace/.autonomous-pid")
        if kill -0 "$pid" 2>/dev/null; then
            echo "  🔄 ${entity^}: Running (PID: $pid)"
        else
            echo "  ✅ ${entity^}: Completed"
            rm -f "$workspace/.autonomous-pid"
        fi
    else
        echo "  ⏸️  ${entity^}: Not started"
    fi
}

# Function to monitor all workspaces
monitor_autonomous_progress() {
    echo ""
    echo "👀 Monitoring autonomous entity generation..."
    echo ""
    
    while true; do
        echo "📊 Status check at $(date):"
        
        check_workspace_status "transaction"
        check_workspace_status "product" 
        check_workspace_status "ledger"
        
        # Check if any are still running
        local running=0
        for entity in transaction product ledger; do
            local workspace="workspaces/claude-${entity}"
            if [ -f "$workspace/.autonomous-pid" ]; then
                local pid=$(cat "$workspace/.autonomous-pid")
                if kill -0 "$pid" 2>/dev/null; then
                    ((running++))
                fi
            fi
        done
        
        if [ $running -eq 0 ]; then
            echo ""
            echo "🎯 All autonomous processes completed!"
            break
        fi
        
        echo ""
        echo "⏳ Waiting 30 seconds for next check..."
        sleep 30
    done
}

# Function to show final results
show_final_results() {
    echo ""
    echo "==============================================================="
    echo "🎯 Autonomous Entity Generation Results"
    echo "==============================================================="
    echo ""
    
    for entity in transaction product ledger; do
        local workspace="workspaces/claude-${entity}"
        echo "📁 ${entity^} Workspace: $workspace"
        
        if [ -f "$workspace/${entity}.ts" ]; then
            local lines=$(wc -l < "$workspace/${entity}.ts")
            local size=$(stat -f%z "$workspace/${entity}.ts" 2>/dev/null || stat -c%s "$workspace/${entity}.ts" 2>/dev/null || echo "0")
            echo "  ✅ ${entity}.ts: $lines lines, ${size} bytes"
        else
            echo "  ❌ ${entity}.ts: Not generated"
        fi
        
        if [ -f "$workspace/sources.md" ]; then
            echo "  ✅ Documentation sources recorded"
        else
            echo "  ⚠️  Documentation sources missing"
        fi
        
        if [ -f "$workspace/iteration-log.md" ]; then
            echo "  ✅ Iteration log available"
        else
            echo "  ⚠️  Iteration log missing"
        fi
        
        echo ""
    done
    
    echo "🔄 Next steps:"
    echo "  1. Review generated entities in each workspace"
    echo "  2. Run validation tests: cd workspaces/claude-[entity] && npm test"
    echo "  3. Copy successful entities to generated/ directory"
    echo "  4. Integrate into MoneyWorks API"
    echo ""
    echo "==============================================================="
}

# Main execution
main() {
    echo "🏗️  Setting up autonomous workspaces..."
    
    # Set up all workspaces
    setup_workspace "transaction"
    setup_workspace "product"
    setup_workspace "ledger"
    
    echo ""
    echo "🚀 Launching all autonomous entities..."
    
    # Ask user for confirmation
    echo "This will launch 3 autonomous Claude instances working independently."
    echo "Each will iterate until all validation tests pass."
    echo ""
    read -p "Continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
    
    # Launch all workspaces
    launch_workspace "transaction"
    sleep 5  # Stagger launches
    launch_workspace "product"
    sleep 5
    launch_workspace "ledger"
    
    echo ""
    echo "🔄 All autonomous instances launched!"
    
    # Monitor progress
    monitor_autonomous_progress
    
    # Show final results
    show_final_results
}

# Handle interruption
trap 'echo ""; echo "🛑 Autonomous deployment interrupted. Cleaning up..."; kill $(jobs -p) 2>/dev/null; exit 1' INT TERM

# Run main function
main "$@" 