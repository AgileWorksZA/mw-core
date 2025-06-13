# MoneyWorks Core - Project Commands

This directory contains **project-specific** Claude Code commands for the MoneyWorks Core development workflow.

## 🏠 Project-Specific Commands

### MoneyWorks Development
- `/mw-dev-cycle` - Complete MoneyWorks development cycle automation
- `/mcp-debug` - Debug MoneyWorks MCP server issues and connectivity

### Legacy Commands
- `/context_prime` - Load project context for development
- `/fix` - Quick fix command
- `/work_in_project` - Project-specific work command

## 🌐 Global Commands Available

The following commands are available globally (in `~/.claude/commands/`):

### Development Workflow
- `/memory-refresh` - Read project files and provide context briefing
- `/smart-commit` - Intelligent commit with conventional formatting + push
- `/sync-from-server` - Safe branch syncing with conflict resolution
- `/project-health` - Comprehensive project diagnostics
- `/smart-pr` - Well-documented pull request creation
- `/workspace-setup` - Development environment verification
- `/quick-open-md` - Open recently created markdown documents

### Code Quality & Analysis
- `/analyze-code` - Comprehensive code analysis and recommendations
- `/security-audit` - Security vulnerability assessment
- `/create-feature` - Structured feature development workflow
- `/fix-issue` - Systematic debugging and issue resolution

## 📋 Usage Examples

### MoneyWorks Specific Workflows:
```bash
/memory-refresh                    # Get project context
/mw-dev-cycle                     # Run MoneyWorks development cycle
/mcp-debug listTables             # Debug specific MCP tool
/smart-commit "fix MW auth"       # Commit with intelligent message
```

### General Development:
```bash
/project-health                   # Check project status
/quick-open-md                    # Open recent documentation
/analyze-code src/services/       # Analyze specific directory
/create-feature "user auth"       # Implement new feature
/security-audit                   # Security assessment
```

## 🔧 Command Organization

**Project Commands** (this directory):
- MoneyWorks-specific automation
- Business logic workflows
- Project-specific debugging tools

**Global Commands** (`~/.claude/commands/`):
- Universal development workflows
- Code quality and analysis tools
- Git and project management utilities

## 📚 Installation

Commands were organized using `setup-claude-commands.sh`:
- Universal commands moved to global (`~/.claude/commands/`)
- MoneyWorks-specific commands remain here
- Team members can run the setup script to get the same configuration

## 🚀 Next Steps

1. **Test commands**: Try `/memory-refresh` to verify global commands work
2. **Customize**: Modify existing commands for your specific needs
3. **Extend**: Add new MoneyWorks-specific commands as needed
4. **Share**: Commands in this directory are version-controlled for the team

Type `/` in Claude Code to see all available commands!