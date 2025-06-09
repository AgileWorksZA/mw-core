# Claude Code Health Check System - Complete Guide

## 🚀 Quick Start

### 1. Automated Setup
```bash
# Run the setup script
npx claude-health-check-setup

# Or manually:
curl -sSL https://example.com/setup.sh | bash
```

### 2. Manual Setup
```bash
# Create directory structure
mkdir -p .claude/commands .github/workflows reports

# Copy command files to .claude/commands/
# Add CI/CD configuration
# Configure environment variables
```

## 📊 Available Commands

### Core Update Commands (MCP-Enhanced)
| Command | Purpose | Key Features |
|---------|---------|--------------|
| `update-release-notes` | Track package updates | **MCP-first strategy**, multi-package, filtering, migration guides |
| `check-dependencies` | Audit all dependencies | Security, updates, deprecation |
| `tech-news-digest` | Industry news summary | Stack-aware, customizable |
| `api-changes` | External API tracking | Breaking changes, deprecations |
| `security-audit` | Security scanning | CVE checking, auto-fixes |

### MCP-Specific Commands
| Command | Purpose | Key Features |
|---------|---------|--------------|
| `git-changelog-analyzer` | Direct git repository analysis | Commits, releases, changelog parsing |
| `mcp-docs-searcher` | Search docs via MCP first | Version-specific, change tracking |
| `repo-health-analyzer` | Repository health metrics | Activity, contributors, trends |
| `mcp-priority-router` | Smart source routing | Fallback strategy, timeout handling |
| `smart-update-checker` | Intelligent update detection | Auto-detects MCP tools, deep analysis |

### Analysis Commands
| Command | Purpose | Key Features |
|---------|---------|--------------|
| `performance-monitor` | Bundle & performance tracking | Size analysis, comparisons |
| `license-checker` | License compliance | Configurable rules |
| `breaking-changes-detector` | API compatibility | Type checking, impact analysis |
| `accessibility-audit` | WCAG compliance | Multiple standards |
| `cost-analyzer` | Cloud cost tracking | Multi-provider, forecasting |

### Utility Commands
| Command | Purpose | Key Features |
|---------|---------|--------------|
| `dashboard` | Unified health report | All checks, multiple formats |
| `notify` | Send notifications | Slack, email, Discord, GitHub |
| `ci-cd-generator` | Create CI/CD configs | Multi-platform support |

## 🎯 Common Workflows

### Daily Developer Check (MCP-Enhanced)
```bash
# Quick security and update check using MCP tools first
/project:check-dependencies type="security"
/project:update-release-notes package="$(jq -r '.dependencies | keys | .[:3] | join(",")' package.json)" format="summary" mcp-first="true"

# Or use the smart checker that auto-detects MCP availability
/project:smart-update-checker deep="false"
```

### Weekly Team Update
```bash
# Comprehensive weekly report
/project:dashboard checks="all" format="markdown" output="weekly-report-$(date +%Y-%m-%d).md"
/project:tech-news-digest days="7"
/project:notify channel="slack" message="weekly-report-*.md" priority="medium"
```

### Pre-Release Audit
```bash
# Full audit before release
/project:security-audit scope="all" severity="medium"
/project:breaking-changes-detector base="v1.0.0"
/project:performance-monitor baseline="main" threshold="5"
/project:license-checker forbidden="GPL,AGPL"
/project:accessibility-audit standard="wcag2aa"
```

### Monthly Deep Dive (MCP-Enhanced)
```bash
# Comprehensive analysis using MCP tools
/project:git-changelog-analyzer repo="facebook/react" since="30d" analysis="all"
/project:update-release-notes package="*" format="detailed" since="30d" mcp-first="true"
/project:repo-health-analyzer repo="." metrics="all" period="30"
/project:cost-analyzer period="monthly" forecast="true"
/project:dashboard checks="all" format="html" notify="email"
```

### MCP-Powered Workflows

#### Direct Repository Analysis
```bash
# Analyze a specific library's git history
/project:git-changelog-analyzer repo="vercel/next.js" since="v14.0.0" until="HEAD"

# Check repository health
/project:repo-health-analyzer repo="." metrics="all" period="90"

# Smart routing through available tools
/project:mcp-priority-router query="React 18 concurrent features" sources="mcp-docs,mcp-git,web"
```

#### Intelligent Update Detection
```bash
# Let Claude detect which tools are available and use them optimally
/project:smart-update-checker deep="true"

# Search documentation with MCP first
/project:mcp-docs-searcher library="react" topics="hooks,suspense" version="18.0.0" changes-only="true"
```

## 🔧 Advanced Configuration

### MCP Tool Configuration

Configure MCP tools for optimal performance:

#### GitMCP Setup
```bash
# Configure git repositories for MCP access
git config --global mcp.enable true
git config --global mcp.repos "facebook/react,vercel/next.js,microsoft/typescript"

# Or in .claude/mcp-config.json:
{
  "git": {
    "repositories": [
      {
        "name": "react",
        "url": "https://github.com/facebook/react",
        "trackBranches": ["main", "experimental"]
      },
      {
        "name": "next",
        "url": "https://github.com/vercel/next.js",
        "trackTags": true
      }
    ]
  },
  "libraryDocs": {
    "sources": ["official", "mdn", "devdocs"],
    "cacheTimeout": 3600
  }
}
```

#### MCP Priority Settings
```json
{
  "searchPriority": {
    "default": ["mcp-git", "mcp-docs", "web"],
    "security": ["mcp-git", "web", "mcp-docs"],
    "features": ["mcp-docs", "mcp-git", "web"]
  }
}
```

### Custom Health Check Profiles

Create `.claude/health-profiles.json`:
```json
{
  "minimal": {
    "checks": ["security", "critical-updates"],
    "schedule": "0 9 * * *",
    "notifications": "slack"
  },
  "standard": {
    "checks": ["security", "updates", "licenses"],
    "schedule": "0 9 * * 1",
    "notifications": "slack,email"
  },
  "comprehensive": {
    "checks": "all",
    "schedule": "0 9 1 * *",
    "notifications": "slack,email,github"
  }
}
```

### Environment Variables
```bash
# Required
CLAUDE_API_KEY=your-api-key

# Optional notifications
SLACK_WEBHOOK=https://hooks.slack.com/...
DISCORD_WEBHOOK=https://discord.com/api/webhooks/...
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASS=your-app-password
GITHUB_TOKEN=ghp_...

# Performance thresholds
PERF_BUNDLE_THRESHOLD=10  # 10% increase warning
PERF_MEMORY_THRESHOLD=20  # 20% increase warning

# Security settings
SECURITY_MIN_SEVERITY=medium
SECURITY_AUTOFIX=true
```

## 📈 Dashboard Customization

### Custom Dashboard Template
Create `.claude/templates/dashboard.md`:
```markdown
# {{project}} Health Report
Generated: {{date}}

## Executive Summary
{{#if critical_issues}}
🚨 **{{critical_issues}} critical issues require immediate attention**
{{else}}
✅ No critical issues found
{{/if}}

## Metrics Overview
- Security Score: {{security_score}}/100
- Dependencies: {{outdated_deps}} outdated
- Performance: {{performance_change}}% change
- License Compliance: {{license_status}}

## Detailed Findings
{{#each sections}}
### {{name}}
{{content}}
{{/each}}
```

## 🔄 CI/CD Integration Examples

### GitHub Actions with Matrix Strategy
```yaml
name: Multi-Environment Health Check

on:
  schedule:
    - cron: '0 */6 * * *'

strategy:
  matrix:
    environment: [development, staging, production]
    node: [18, 20]

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Health Check
        env:
          ENVIRONMENT: ${{ matrix.environment }}
          NODE_VERSION: ${{ matrix.node }}
        run: |
          claude-code run dashboard \
            --checks="${{ matrix.environment == 'production' && 'all' || 'security,updates' }}"
```

### GitLab with Parallel Jobs
```yaml
health-check:
  stage: test
  parallel:
    matrix:
      - CHECK: [security, performance, licenses, accessibility]
  script:
    - claude-code run ${CHECK}-audit
  artifacts:
    reports:
      junit: reports/${CHECK}-report.xml
```

## 📊 Metrics and KPIs

### Track These Key Metrics
1. **Security Health Score**: (100 - (critical × 20 + high × 10 + medium × 5))
2. **Dependency Freshness**: % of dependencies on latest major version
3. **Bundle Size Trend**: % change over time
4. **License Risk Score**: Based on forbidden licenses found
5. **API Stability**: # of breaking changes in dependencies

### Creating Custom Metrics
```javascript
// .claude/commands/custom-metrics.js
export default {
  name: "custom-metrics",
  description: "Calculate custom health metrics",
  execute: async () => {
    // Your custom logic
    return {
      techDebt: calculateTechDebt(),
      testCoverage: getTestCoverage(),
      codeQuality: analyzeCodeQuality()
    };
  }
};
```

## 🚨 Alerting Rules

### Severity Mapping
```javascript
const alertRules = {
  critical: {
    conditions: [
      "security.critical > 0",
      "performance.degradation > 50",
      "dependencies.vulnerable > 5"
    ],
    actions: ["slack", "email", "pagerduty"]
  },
  high: {
    conditions: [
      "security.high > 3",
      "performance.degradation > 20",
      "licenses.forbidden > 0"
    ],
    actions: ["slack", "email"]
  }
};
```

## 🔍 Troubleshooting

### Common Issues

**1. Command not found**
```bash
# Ensure commands are in correct directory
ls -la .claude/commands/

# Check file permissions
chmod +x .claude/commands/*.js
```

**2. API rate limits**
```bash
# Add delays between commands
/project:dashboard checks="security" && sleep 60 && /project:dashboard checks="updates"
```

**3. Large repositories**
```bash
# Use filtering and pagination
/project:update-release-notes package="react" --max-results=10
```

## 📚 Best Practices

1. **Start Small**: Begin with security and critical updates
2. **Automate Gradually**: Add more checks as you establish baselines
3. **Set Realistic Thresholds**: Avoid alert fatigue
4. **Review Regularly**: Update allowed/forbidden lists monthly
5. **Document Exceptions**: Keep a record of accepted risks
6. **Integrate with Existing Tools**: Complement, don't replace
7. **Train Your Team**: Ensure everyone understands the reports

## 🎉 Success Stories

### Example: E-commerce Platform
- **Before**: 47 outdated dependencies, 12 security vulnerabilities
- **After 3 months**: 5 outdated dependencies, 0 vulnerabilities
- **Result**: 60% faster builds, 100% security compliance

### Example: SaaS Startup
- **Challenge**: No visibility into technical debt
- **Solution**: Weekly automated reports
- **Outcome**: 40% reduction in production incidents

## 🔗 Resources

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Example Configurations](https://github.com/examples/claude-health-checks)
- [Community Templates](https://claude-code-templates.dev)
- [Video Tutorials](https://youtube.com/claude-code-health)

## 💡 Pro Tips

1. **Combine with Git Hooks**: Run checks on pre-commit
2. **Create Team Dashboards**: Different views for different roles
3. **Export to BI Tools**: Send metrics to Datadog, Grafana
4. **Version Your Configs**: Track health check configuration changes
5. **Benchmark Against Industry**: Compare your metrics

Remember: The goal is continuous improvement, not perfection!