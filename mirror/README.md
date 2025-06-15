# MoneyWorks Documentation Mirror

This directory contains the complete MoneyWorks documentation mirror created using httrack.

## 📁 Directory Structure

### **PRIMARY SOURCE: `./manual/`** ✅
- **Use this first** - Complete website mirror from httrack
- **1197+ HTML files** with proper navigation and search
- **Full images and assets** preserved from original site
- **Searchable via `/mw-docs` command** and macOS Spotlight
- **Source**: Direct mirror of https://secure.cognito.co.nz/manual/

### **BACKUP ONLY: `./pdf-extracted-dont-use/`** ⚠️  
- **Use only as last resort** - Extracted from PDF documentation
- **1032 HTML files** with limited formatting and navigation
- **Missing context** - Individual sections without proper linking
- **Use only if**: Content cannot be found in `./manual/` directory

### **Developer Resources: `./developer/`**
- **Developer documentation** and API references
- **Supplementary content** for MoneyWorks integration

## 🔄 Updating the Mirror

To update the MoneyWorks documentation mirror, run the httrack script:

```bash
# Navigate to project root
cd /path/to/mw-core

# Run the httrack mirror script
./scripts/mirror-moneyworks-docs.sh

# Alternative: Run httrack directly
httrack https://secure.cognito.co.nz/manual/ \
  -O "./mirror/manual" \
  --depth=5 \
  --ext-depth=2 \
  --mirror \
  --robots=0 \
  --timeout=60 \
  --retries=3
```

**Note**: Update frequency should be quarterly or when MoneyWorks releases documentation updates.

## 🔍 Searching Documentation

### Using Claude Commands
```bash
/mw-docs "chart of accounts"     # Semantic search of mirror docs
/mw-docs payments               # Find payment-related documentation
/project-search "invoices"      # Search across project and mirror
```

### Direct Search
```bash
# Search mirror documentation
mdfind -onlyin ./mirror/manual "accounts"

# Search specific topics
mdfind -onlyin ./mirror/manual "kMDItemContentType == 'public.html' AND invoice"
```

## 📋 Documentation Priorities

1. **Always check `./manual/` first** - Most complete and up-to-date
2. **Use `/mw-docs` command** - Intelligent semantic search
3. **Fallback to `./pdf-extracted-dont-use/`** - Only if manual missing content
4. **Update mirror quarterly** - Keep documentation current

## 🎯 Integration with Development

The mirror documentation is integrated with:
- **Claude Code `/mw-docs` command** - Context-aware documentation lookup
- **MCP server debugging** - Reference materials during development
- **API development** - Field descriptions and workflow understanding
- **Team onboarding** - Complete MoneyWorks domain knowledge

## ⚠️ Important Notes

- **Manual mirror is authoritative** - Always prefer over PDF extracts
- **PDF extracts are fragmented** - Missing navigation and context
- **Keep httrack updated** - Ensure compatibility with MoneyWorks site changes
- **Respect rate limits** - Don't over-query the source website during updates