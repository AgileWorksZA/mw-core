# MoneyWorks Core - Claude Code Assistant

This project leverages advanced Claude Code commands and intelligent search capabilities for MoneyWorks API development and documentation access.

## 🔍 **Intelligent Search Tools**

This project comes equipped with powerful search capabilities that understand MoneyWorks semantics:

### **Universal Project Search** 
- **`/project-search`** - Smart project-wide search using corrected macOS Spotlight (mdfind) syntax
  - Example: `/project-search authentication` → finds auth middleware, config, and tests
  - Example: `/project-search "transaction types"` → discovers MoneyWorks transaction documentation and code

### **MoneyWorks Documentation Search**  
- **`/mw-docs`** - Context-aware search of canonical MoneyWorks documentation in `./mirror/`
  - Example: `/mw-docs "chart of accounts"` → opens account management and setup docs
  - Example: `/mw-docs creditors` → finds payment, supplier, and creditor documentation

### **Advanced Search Foundation**
- **`/mdfind-guide`** - Comprehensive guide to macOS Spotlight search with corrected syntax
  - Essential reading for understanding the search technology these commands use
  - Contains working examples tested against this project's MoneyWorks documentation

## 🚀 **Full Command Suite**

**Want the complete professional command suite?** 

👉 **Get all 16 Claude Code commands from dotfiles**: `~/dotfiles/claude/commands/README.md`

The full suite includes:
- **7 Workflow Commands**: `/memory-refresh`, `/smart-commit`, `/project-health`, `/smart-pr`, etc.
- **3 Search Commands**: `/project-search`, `/mw-docs`, `/mdfind-guide` (detailed above)  
- **4 Quality Commands**: `/analyze-code`, `/security-audit`, `/create-feature`, `/fix-issue`
- **2 Utility Commands**: `/workspace-setup`, `/quick-open-md`

## 🎯 **MoneyWorks-Specific Magic**

These commands understand MoneyWorks domain concepts:

```bash
# Smart semantic search - understands MoneyWorks terminology
/project-search "customers"        # → finds names, debtors, contacts
/project-search "invoices"         # → finds debtors, transactions, forms
/project-search "payments"         # → finds cash, creditors, banking

# Context-aware documentation  
/mw-docs accounts                  # → chart of accounts, account types, setup
/mw-docs calculations              # → scripting functions, automation
/mw-docs datacentre               # → server setup, networking, deployment
```

## 📚 **MoneyWorks Documentation Structure**

This project includes the complete MoneyWorks documentation mirror in `./mirror/manual/manual/`:
- **1000+ HTML documentation files** covering every MoneyWorks feature
- **Fully indexed by macOS Spotlight** for instant content search
- **Semantic search mapping** from user concepts to MoneyWorks terminology
- **Cross-referenced** with API development and MCP server debugging

## 🛠 **Perfect for Development**

The search tools excel at:
- **API Development**: Find related documentation while building endpoints
- **MCP Debugging**: Quick access to MoneyWorks concepts during server development  
- **Schema Design**: Reference official field descriptions and data structures
- **Integration Work**: Understand MoneyWorks workflows and business logic

## 🔗 **Integration Points**

These commands integrate seamlessly with:
- **MoneyWorks MCP Server** - Documentation lookup during debugging
- **API Development** - Reference materials for endpoint design
- **Testing Workflows** - Understanding expected behaviors and edge cases
- **Team Onboarding** - Instant access to domain knowledge

---

**💡 Pro Tip**: Start with `/mdfind-guide` to understand the search technology, then use `/project-search` and `/mw-docs` to become a MoneyWorks development wizard!

**📖 Full Documentation**: See `~/dotfiles/claude/commands/README.md` for the complete command reference and installation guide.