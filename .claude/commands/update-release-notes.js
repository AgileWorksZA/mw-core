// 1. Enhanced update-release-notes.js
export const updateReleaseNotes = {
    name: "update-release-notes",
    description: "Fetch and summarize release notes with advanced filtering and formatting",
    args: [
        {
            name: "package",
            description: "Package name or comma-separated list (e.g., 'bun' or 'react,next,typescript')",
            required: true
        },
        {
            name: "output",
            description: "Output filename (defaults to '<package>-updates.md')",
            required: false
        },
        {
            name: "since",
            description: "Start date (defaults to '2025-01-31')",
            required: false
        },
        {
            name: "filter",
            description: "Filter changes by type: 'breaking', 'features', 'security', 'all' (default: 'all')",
            required: false
        },
        {
            name: "current",
            description: "Current version in your project (for migration guides)",
            required: false
        },
        {
            name: "format",
            description: "Output format: 'detailed', 'summary', 'migration' (default: 'detailed')",
            required: false
        },
        {
            name: "sources",
            description: "Include source links: true/false (default: true)",
            required: false
        },
        {
            name: "mcp-first",
            description: "Prioritize MCP tools over web search: true/false (default: true)",
            required: false
        }
    ],
    execute: async (args) => {
        const packages = args.package.split(',').map(p => p.trim());
        const format = args.format || 'detailed';
        const filter = args.filter || 'all';
        const useMcpFirst = args['mcp-first'] !== 'false';

        return {
            task: "fetch_release_notes",
            packages: packages,
            since: args.since || "2025-01-31",
            output: args.output || `${packages.join('-')}-updates.md`,
            currentVersion: args.current,
            includeSourceLinks: args.sources !== 'false',
            format: format,
            filter: filter,
            mcpPriority: useMcpFirst,
            searchStrategy: [
                "IMPORTANT: Follow this search strategy in order:",
                "1. First, check if MCP tools are available (library-docs, git repositories via gitmcp)",
                "2. If available, use MCP tools to query for release notes:",
                "   - Use library-docs MCP tool to search for official documentation updates",
                "   - Use gitmcp to query the actual git repository for:",
                "     - CHANGELOG.md or CHANGELOG files",
                "     - GitHub releases via git tags and release notes",
                "     - Commit history between versions if no formal changelog exists",
                "   - Parse version tags to identify releases after the 'since' date",
                "3. Only if MCP tools are unavailable or return insufficient data, use web_search as fallback",
                "4. When using MCP tools, prefer structured data from the actual repository over web results"
            ],
            instructions: {
                detailed: [
                    "Create comprehensive release notes with all changes",
                    "Include code examples for major changes",
                    "Add migration notes if current version specified",
                    "Group by version with clear headings",
                    "Include performance impacts and benchmarks if available",
                    "When using gitmcp, include relevant commit SHAs for traceability"
                ],
                summary: [
                    "Create a concise bullet-point summary",
                    "Focus only on most important changes",
                    "One-line description per change",
                    "Group by impact level (Critical/High/Medium)"
                ],
                migration: [
                    "Focus exclusively on breaking changes",
                    "Provide step-by-step migration guide",
                    "Include before/after code examples",
                    "List deprecated features and alternatives",
                    "Add estimated migration effort",
                    "If using gitmcp, link to specific commits that introduced breaking changes"
                ]
            }[format]
        };
    }
};

// 2. check-dependencies.js
export const checkDependencies = {
    name: "check-dependencies",
    description: "Check all project dependencies for updates and security issues",
    args: [
        {
            name: "type",
            description: "Check type: 'updates', 'security', 'deprecated', 'all' (default: 'all')",
            required: false
        },
        {
            name: "severity",
            description: "For security: 'critical', 'high', 'medium', 'low', 'all' (default: 'high')",
            required: false
        },
        {
            name: "output",
            description: "Output file for report (default: 'dependency-report.md')",
            required: false
        },
        {
            name: "fix",
            description: "Generate fix commands: true/false (default: true)",
            required: false
        }
    ],
    execute: async (args) => {
        return {
            task: "check_dependencies",
            type: args.type || 'all',
            severity: args.severity || 'high',
            output: args.output || 'dependency-report.md',
            generateFixes: args.fix !== 'false',
            instructions: [
                "Read package.json to get all dependencies",
                "Check each dependency for updates since January 2025",
                "Search for security advisories",
                "Check for deprecated packages",
                "Generate report with actionable recommendations",
                "Include upgrade commands if fix=true"
            ]
        };
    }
};

// 3. tech-news-digest.js
export const techNewsDigest = {
    name: "tech-news-digest",
    description: "Create a digest of important tech news and updates relevant to your stack",
    args: [
        {
            name: "topics",
            description: "Topics to cover (e.g., 'javascript,web-security,ai-tools')",
            required: false
        },
        {
            name: "days",
            description: "Number of days to look back (default: 7)",
            required: false
        },
        {
            name: "stack",
            description: "Auto-detect from package.json: true/false (default: true)",
            required: false
        },
        {
            name: "output",
            description: "Output filename (default: 'tech-digest-YYYY-MM-DD.md')",
            required: false
        }
    ],
    execute: async (args) => {
        const date = new Date().toISOString().split('T')[0];

        return {
            task: "tech_news_digest",
            topics: args.topics?.split(',').map(t => t.trim()),
            days: parseInt(args.days) || 7,
            autoDetectStack: args.stack !== 'false',
            output: args.output || `tech-digest-${date}.md`,
            instructions: [
                "If autoDetectStack, read package.json to identify tech stack",
                "Search for major announcements, releases, and security issues",
                "Filter for relevance to the project's technology",
                "Organize by category: Security Alerts, New Releases, Industry News",
                "Add impact assessment for each item",
                "Include action items where applicable"
            ]
        };
    }
};

// 4. api-changes.js
export const apiChanges = {
    name: "api-changes",
    description: "Track API changes for services your project depends on",
    args: [
        {
            name: "services",
            description: "API services to check (e.g., 'openai,stripe,github')",
            required: true
        },
        {
            name: "since",
            description: "Check changes since date (default: '2025-01-31')",
            required: false
        },
        {
            name: "endpoints",
            description: "Include endpoint-level changes: true/false (default: true)",
            required: false
        },
        {
            name: "output",
            description: "Output file (default: 'api-changes.md')",
            required: false
        }
    ],
    execute: async (args) => {
        return {
            task: "check_api_changes",
            services: args.services.split(',').map(s => s.trim()),
            since: args.since || '2025-01-31',
            includeEndpoints: args.endpoints !== 'false',
            output: args.output || 'api-changes.md',
            instructions: [
                "Search for API changelog/updates for each service",
                "Focus on breaking changes, deprecations, and new features",
                "Include rate limit changes",
                "Add code examples for migration if applicable",
                "Check for new API versions",
                "Include pricing changes if any"
            ]
        };
    }
};

// 5. security-audit.js
export const securityAudit = {
    name: "security-audit",
    description: "Comprehensive security audit for dependencies and practices",
    args: [
        {
            name: "scope",
            description: "Audit scope: 'dependencies', 'code', 'config', 'all' (default: 'all')",
            required: false
        },
        {
            name: "output",
            description: "Output file (default: 'security-audit-YYYY-MM-DD.md')",
            required: false
        },
        {
            name: "autofix",
            description: "Generate fix scripts: true/false (default: true)",
            required: false
        },
        {
            name: "severity",
            description: "Minimum severity to report: 'low', 'medium', 'high', 'critical' (default: 'low')",
            required: false
        }
    ],
    execute: async (args) => {
        const date = new Date().toISOString().split('T')[0];

        return {
            task: "security_audit",
            scope: args.scope || 'all',
            output: args.output || `security-audit-${date}.md`,
            generateFixes: args.autofix !== 'false',
            minSeverity: args.severity || 'low',
            instructions: [
                "Check npm/yarn audit for known vulnerabilities",
                "Search for recent CVEs affecting the stack",
                "Review security best practices updates since Jan 2025",
                "Check for exposed secrets or sensitive data patterns",
                "Generate remediation scripts if autofix=true",
                "Prioritize by severity and exploitability",
                "Include CVSS scores where available"
            ]
        };
    }
};

// Example of how to export all commands from a single file
export default [
    updateReleaseNotes,
    checkDependencies,
    techNewsDigest,
    apiChanges,
    securityAudit
];