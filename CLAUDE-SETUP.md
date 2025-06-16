# Claude Code Setup Guide

This guide helps team members set up Claude Code commands for optimal productivity on the MoneyWorks Core project.

## 🚀 Quick Setup

### 1. Install Global Commands (One-time setup)
```bash
# Create global commands directory
mkdir -p ~/.claude/commands

# Copy universal commands to global location
# (These will be available in ALL your projects)
cp .claude/commands/README.md ~/.claude/commands/
```

### 2. Install Community Commands (Optional)
```bash
# Install Claude Command Suite for professional workflows
git clone https://github.com/qdhenry/Claude-Command-Suite.git /tmp/claude-suite
cp -r /tmp/claude-suite/commands/* ~/.claude/commands/ 2>/dev/null || true
rm -rf /tmp/claude-suite
```

## 🎯 Available Commands

### 🌐 Global Commands (Available Everywhere)
After setup, these commands work in any project:

**Development Workflow:**
- `/memory-refresh` - Read project context and provide briefing
- `/smart-commit` - Intelligent commit with conventional formatting + push
- `/sync-from-server` - Safe branch syncing with conflict resolution
- `/project-health` - Comprehensive project diagnostics
- `/smart-pr` - Well-documented pull request creation
- `/workspace-setup` - Development environment verification
- `/quick-open-md` - Open recently created markdown documents

**Intelligent Search & Discovery:**
- `/project-search` - Smart project-wide search using macOS Spotlight
- `/mw-docs` - Intelligent MoneyWorks documentation search and access
- `/mdfind-guide` - Comprehensive guide to macOS mdfind command

**Code Quality & Analysis:**
- `/analyze-code` - Code analysis and recommendations
- `/security-audit` - Security vulnerability assessment
- `/create-feature` - Structured feature development
- `/fix-issue` - Systematic debugging and issue resolution

**Total: 16 global commands** available across all projects

### 🏠 MoneyWorks Project Commands (This Project Only)
These are automatically available when working in this project:

- `/mw-dev-cycle` - Complete MoneyWorks development cycle automation
- `/mcp-debug` - Debug MoneyWorks MCP server issues and connectivity

## 📋 Typical Workflows

### Daily Development Workflow:
```bash
/memory-refresh                    # Get current project context
/project-health                   # Check project status
/mw-dev-cycle                     # Run MoneyWorks-specific checks
# ... do your development work ...
/smart-commit "implement feature" # Commit with intelligent message
```

### Feature Development:
```bash
/memory-refresh                    # Understand current state
/create-feature "user authentication"  # Plan and implement feature
/security-audit                   # Check security implications
/smart-pr                         # Create well-documented PR
```

### Debugging MoneyWorks Issues:
```bash
/mcp-debug listTables             # Debug specific MCP tool
/mcp-debug                        # General MCP debugging
/fix-issue "authentication error" # Systematic issue resolution
```

## 🔧 Verification

Test your setup:
```bash
# This should work in any project after global setup
/memory-refresh

# This should work only in the MoneyWorks project
/mw-dev-cycle
```

## 📚 Command Organization

**Global Commands** (`~/.claude/commands/`):
- ✅ Available in ALL projects
- ✅ Universal development workflows
- ✅ Personal productivity tools

**Project Commands** (`.claude/commands/`):
- ✅ MoneyWorks-specific automation
- ✅ Shared with team via git
- ✅ Override global commands if same name

## 🤝 Team Benefits

1. **Consistency**: Everyone uses the same development workflows
2. **Productivity**: Automated common tasks and best practices
3. **Quality**: Built-in code analysis, security checks, and proper git workflows
4. **Onboarding**: New team members get proven workflows immediately
5. **Knowledge Sharing**: Commands encode team's best practices

## 🆘 Troubleshooting

**Commands not appearing?**
- Ensure you're in the correct directory for project commands
- Check global directory exists: `ls ~/.claude/commands/`
- Restart Claude Code session

**Global commands not working?**
- Verify files are in `~/.claude/commands/` not project directory
- Check file permissions and `.md` extension

**Want to customize?**
- Edit existing `.md` files to modify commands
- Add new `.md` files following the existing pattern
- Test commands before committing project-specific ones

## 💡 Pro Tips

- Use **tab completion** after typing `/` to see available commands
- **Chain commands** for powerful workflows
- **Customize commands** by editing the `.md` files
- **Share improvements** by committing updated project commands
- **Use global commands** for universal workflows across all your projects

This setup gives you AI-powered development automation that scales from individual productivity to team collaboration!