# MoneyWorks MCP Improvements Documentation

## Overview

This folder contains documentation for tracking and implementing improvements to the MoneyWorks MCP (Model Context Protocol) server. The MCP server provides Claude Code with access to MoneyWorks accounting data through 44 specialized tools organized into 8 functional categories.

## Documentation Structure

### Category-Based Organization

The improvements are organized by MCP tool categories to maintain focus and prevent overwhelming single documents:

1. **[core-data-tools.md](./core-data-tools.md)** - Primary business data access (4 tools)
   - `accounts`, `transactions`, `names`, `builds`

2. **[system-metadata-tools.md](./system-metadata-tools.md)** - Schema and system information (12 tools)
   - Schema tools, API information, system status, validation rules

3. **[format-localization-tools.md](./format-localization-tools.md)** - Data formatting and i18n (16 tools)
   - Enums, date/time, currency, labels and translations

4. **[security-permissions-tools.md](./security-permissions-tools.md)** - Security and access control (5 tools)
   - Permissions, user roles, security auditing

5. **[evaluation-scripting-tools.md](./evaluation-scripting-tools.md)** - Expression evaluation (3 tools)
   - MoneyWorks expressions, templates, scripting

6. **[reporting-tools.md](./reporting-tools.md)** - Report generation (3 tools)
   - HTML reports, parameters, common reports

7. **[company-info-tools.md](./company-info-tools.md)** - Company configuration (2 tools)
   - Company details and system settings

8. **[error-tracking-tools.md](./error-tracking-tools.md)** - Support and issue tracking (1 tool)
   - Bug reports, feature requests, improvements

### Master Documents

- **[BACKLOG.md](./BACKLOG.md)** - Master task list with checkboxes for all 44 tools
- **[FIXES.md](./FIXES.md)** - Specific bugs and fixes that need implementation

## How to Use This System

### For Claude Developers

1. **Finding Issues**: Each category document contains known issues and improvement opportunities for those specific tools
2. **Logging New Issues**: Use the templates provided in each category document to add new issues
3. **Tracking Progress**: Use the BACKLOG.md checkboxes to mark completed improvements
4. **Implementation**: Reference the specific tool documentation for implementation details

### Adding New Issues

When you discover an issue or improvement opportunity:

1. **Identify the Category**: Determine which of the 8 categories the tool belongs to
2. **Use the Template**: Each category document has a standardized issue template
3. **Update the Backlog**: Add the item to BACKLOG.md if it's a new tool improvement
4. **Cross-Reference**: Link related issues across categories when applicable

### Issue Template Format

Each issue should include:

```markdown
## Tool: [tool-name]

### Issue: [Brief Description]
- **Type**: Bug | Feature Request | Improvement
- **Severity**: Low | Medium | High | Critical
- **Component**: [Specific part of the tool]

### Current Behavior
[What currently happens]

### Expected Behavior
[What should happen]

### Proposed Solution
[Detailed implementation approach]

### Implementation Notes
[Technical details, code references, etc.]

### Related Issues
[Links to related improvements]
```

## Progress Tracking

- ✅ **Completed**: Feature implemented and tested
- 🔄 **In Progress**: Currently being worked on
- 📋 **Planned**: In backlog, ready for implementation
- 🚫 **Blocked**: Cannot proceed due to dependencies
- ❌ **Won't Fix**: Decided against implementation

## Integration with MCP Development

This documentation system is designed to:

1. **Complement the MCP Server Code**: Provide improvement tracking without cluttering the codebase
2. **Enable Collaborative Improvement**: Allow multiple Claude instances to contribute improvements
3. **Maintain Context**: Preserve institutional knowledge about why certain decisions were made
4. **Track Dependencies**: Understand how improvements relate to each other

## Getting Started

1. Review the [BACKLOG.md](./BACKLOG.md) to understand current priorities
2. Pick a category that interests you and review its specific documentation
3. Look for issues marked as "Good First Issue" for newcomers
4. Follow the implementation guidelines in each category document

## Contributing Guidelines

1. **Be Specific**: Clearly describe the problem and proposed solution
2. **Consider Impact**: Think about how changes affect other tools or users
3. **Test Thoroughly**: Include test cases and validation approaches
4. **Document Everything**: Update both code and documentation
5. **Follow Patterns**: Maintain consistency with existing tool patterns

This system ensures that MCP improvements are well-organized, trackable, and maintainable as the MoneyWorks integration evolves.