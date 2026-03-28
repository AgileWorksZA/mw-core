// git-changelog-analyzer.js
export const gitChangelogAnalyzer = {
    name: "git-changelog-analyzer",
    description: "Analyze git repositories directly using MCP tools for detailed changelog information",
    args: [
        {
            name: "repo",
            description: "Repository to analyze (e.g., 'facebook/react', 'vercel/next.js', or local path)",
            required: true
        },
        {
            name: "since",
            description: "Analyze changes since this date or tag (default: '2025-01-31')",
            required: false
        },
        {
            name: "until",
            description: "Analyze changes until this date or tag (default: 'HEAD')",
            required: false
        },
        {
            name: "analysis",
            description: "Type of analysis: 'changelog', 'commits', 'releases', 'all' (default: 'all')",
            required: false
        },
        {
            name: "output",
            description: "Output file (default: '<repo>-analysis.md')",
            required: false
        }
    ],
    execute: async (args) => {
        const repoName = args.repo.split('/').pop();

        return {
            task: "analyze_git_changelog",
            repository: args.repo,
            since: args.since || "2025-01-31",
            until: args.until || "HEAD",
            analysisType: args.analysis || 'all',
            output: args.output || `${repoName}-analysis.md`,
            mcpInstructions: [
                "Use gitmcp to connect to the repository",
                "Query for the following in order:",
                "1. Check for CHANGELOG.md, CHANGELOG, NEWS, HISTORY files",
                "2. List all tags/releases between 'since' and 'until' dates",
                "3. For each release tag, get the associated release notes",
                "4. If no formal changelog, analyze commit messages between versions",
                "5. Group commits by type (feat, fix, chore, breaking change, etc.)",
                "6. Extract breaking changes from commit messages with 'BREAKING CHANGE' footer",
                "7. Identify security-related commits (keywords: security, vulnerability, CVE)",
                "8. Generate structured output with version comparisons"
            ],
            analysisTypes: {
                changelog: [
                    "Focus on official changelog files",
                    "Parse markdown structure to extract versions",
                    "Maintain original formatting where possible"
                ],
                commits: [
                    "Analyze all commits between versions",
                    "Group by conventional commit types",
                    "Extract commit messages and authors",
                    "Identify merge commits from PRs"
                ],
                releases: [
                    "Focus on GitHub/GitLab releases",
                    "Extract release notes and assets",
                    "Include download statistics if available",
                    "Note pre-releases and draft releases"
                ],
                all: [
                    "Combine all analysis types",
                    "Cross-reference releases with commits",
                    "Provide comprehensive version history",
                    "Include migration paths between versions"
                ]
            }[args.analysis || 'all']
        };
    }
};

// mcp-docs-searcher.js
export const mcpDocsSearcher = {
    name: "mcp-docs-searcher",
    description: "Search library documentation using MCP tools before web search",
    args: [
        {
            name: "library",
            description: "Library name to search docs for",
            required: true
        },
        {
            name: "topics",
            description: "Specific topics to search (comma-separated)",
            required: false
        },
        {
            name: "version",
            description: "Specific version to check (default: latest)",
            required: false
        },
        {
            name: "changes-only",
            description: "Only show what's changed: true/false (default: false)",
            required: false
        }
    ],
    execute: async (args) => {
        return {
            task: "search_mcp_docs",
            library: args.library,
            topics: args.topics?.split(',').map(t => t.trim()),
            version: args.version || 'latest',
            changesOnly: args['changes-only'] === 'true',
            searchStrategy: [
                "1. Check if library-docs MCP tool is available",
                "2. If available, search for:",
                "   - Migration guides",
                "   - Breaking changes documentation",
                "   - New features documentation",
                "   - API reference changes",
                "3. Compare with previous version if changes-only is true",
                "4. Only use web_search if MCP tools are unavailable"
            ]
        };
    }
};

// repo-health-analyzer.js
export const repoHealthAnalyzer = {
    name: "repo-health-analyzer",
    description: "Analyze repository health using git data via MCP",
    args: [
        {
            name: "repo",
            description: "Repository to analyze (local path or remote URL)",
            required: true
        },
        {
            name: "metrics",
            description: "Metrics to calculate: 'activity,contributors,issues,all' (default: 'all')",
            required: false
        },
        {
            name: "period",
            description: "Analysis period in days (default: 90)",
            required: false
        },
        {
            name: "output",
            description: "Output file (default: 'repo-health.md')",
            required: false
        }
    ],
    execute: async (args) => {
        return {
            task: "analyze_repo_health",
            repository: args.repo,
            metrics: args.metrics || 'all',
            period: parseInt(args.period) || 90,
            output: args.output || 'repo-health.md',
            mcpAnalysis: [
                "Use gitmcp to analyze repository health:",
                "1. Commit frequency and patterns",
                "2. Active contributors in the period",
                "3. Issue/PR velocity if accessible",
                "4. Release cadence",
                "5. Documentation updates frequency",
                "6. Test coverage trends (from commit messages)",
                "7. Security patch response time"
            ],
            metricsToCalculate: {
                activity: [
                    "Commits per week/month",
                    "Code churn rate",
                    "Active development branches",
                    "Merge frequency"
                ],
                contributors: [
                    "Number of active contributors",
                    "Contributor diversity",
                    "New vs returning contributors",
                    "Bus factor analysis"
                ],
                issues: [
                    "Open/closed issue ratio",
                    "Average time to close",
                    "Issue labels distribution",
                    "Security issue response time"
                ],
                all: [
                    "All above metrics",
                    "Overall health score",
                    "Trend analysis",
                    "Recommendations"
                ]
            }[args.metrics || 'all']
        };
    }
};

// mcp-priority-router.js
export const mcpPriorityRouter = {
    name: "mcp-priority-router",
    description: "Route information requests through MCP tools with fallback to web",
    args: [
        {
            name: "query",
            description: "What information to find",
            required: true
        },
        {
            name: "sources",
            description: "Preferred sources in order (e.g., 'mcp-git,mcp-docs,web')",
            required: false
        },
        {
            name: "timeout",
            description: "Timeout for each source in seconds (default: 10)",
            required: false
        },
        {
            name: "fallback",
            description: "Use web search as fallback: true/false (default: true)",
            required: false
        }
    ],
    execute: async (args) => {
        const defaultSources = ['mcp-git', 'mcp-docs', 'web'];
        const sources = args.sources?.split(',').map(s => s.trim()) || defaultSources;

        return {
            task: "route_information_request",
            query: args.query,
            sources: sources,
            timeout: parseInt(args.timeout) || 10,
            useFallback: args.fallback !== 'false',
            routingStrategy: [
                "Try each source in order until sufficient information is found:",
                ...sources.map((source, index) => {
                    const strategies = {
                        'mcp-git': `${index + 1}. MCP Git: Use gitmcp to search repositories for ${args.query}`,
                        'mcp-docs': `${index + 1}. MCP Docs: Use library-docs tool to search documentation`,
                        'web': `${index + 1}. Web Search: Use web_search as final fallback`
                    };
                    return strategies[source] || `${index + 1}. Unknown source: ${source}`;
                }),
                "Stop when sufficient information is found",
                "Combine results if multiple sources provide complementary data"
            ]
        };
    }
};

// Example composite command that uses MCP tools intelligently
export const smartUpdateChecker = {
    name: "smart-update-checker",
    description: "Intelligently check for updates using all available MCP tools",
    args: [
        {
            name: "package",
            description: "Package to check (auto-detects all if not specified)",
            required: false
        },
        {
            name: "deep",
            description: "Perform deep analysis including git history: true/false (default: false)",
            required: false
        },
        {
            name: "compare-local",
            description: "Compare with local package.json versions: true/false (default: true)",
            required: false
        }
    ],
    execute: async (args) => {
        return {
            task: "smart_update_check",
            package: args.package,
            deepAnalysis: args.deep === 'true',
            compareLocal: args['compare-local'] !== 'false',
            workflow: [
                "1. Read package.json to get current dependencies",
                "2. For each dependency:",
                "   a. Check if gitmcp can access the repository",
                "   b. If yes, get latest releases and changelog from git",
                "   c. Check library-docs MCP for documentation updates",
                "   d. Only use web_search if MCP tools unavailable",
                "3. Compare findings with current versions",
                "4. Generate prioritized update recommendations",
                "5. Include migration complexity estimates"
            ],
            priorityOrder: [
                "Security updates (CRITICAL)",
                "Breaking changes requiring migration (HIGH)",
                "Major feature additions (MEDIUM)",
                "Bug fixes and minor updates (LOW)"
            ]
        };
    }
};

export default [
    gitChangelogAnalyzer,
    mcpDocsSearcher,
    repoHealthAnalyzer,
    mcpPriorityRouter,
    smartUpdateChecker
];