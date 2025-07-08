import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { Package, Code2, Database, Globe, ArrowRight, Terminal, Server, Download, GitBranch, Users, Zap } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Packages - MoneyWorks Core Documentation" },
    { name: "description", content: "Explore all MoneyWorks Core packages" },
  ];
};

export default function PackagesIndex() {
  const packages = [
    {
      name: "@moneyworks/utilities",
      version: "0.1.0",
      description: "Core utilities and branded types for type-safe MoneyWorks development",
      features: [
        "Branded types (YYYYMMDD, AccountCode, etc.)",
        "Type guards and validators",
        "Zero dependencies",
        "Full TypeScript support"
      ],
      icon: <Code2 className="h-6 w-6" />,
      href: "/packages/utilities",
      npm: "@moneyworks/utilities",
      stats: {
        size: "12KB",
        deps: 0,
        weekly: "1.2K"
      },
      tags: ["core", "typescript", "utilities"],
      color: "bg-blue-500",
    },
    {
      name: "@moneyworks/data",
      version: "1.0.0",
      description: "Data access layer for MoneyWorks with smart export capabilities",
      features: [
        "Multiple export formats",
        "Lazy field discovery",
        "Smart type detection",
        "Streaming support"
      ],
      icon: <Database className="h-6 w-6" />,
      href: "/packages/data",
      npm: "@moneyworks/data",
      stats: {
        size: "28KB",
        deps: 2,
        weekly: "850"
      },
      tags: ["data", "export", "streaming"],
      color: "bg-green-500",
      dependencies: ["@moneyworks/utilities", "@moneyworks/canonical"],
    },
    {
      name: "@moneyworks/canonical",
      version: "1.0.0",
      description: "Canonical type definitions for all MoneyWorks entities",
      features: [
        "Complete MW type system",
        "JSDoc documentation",
        "Field metadata",
        "Relationship mapping"
      ],
      icon: <Package className="h-6 w-6" />,
      href: "/packages/canonical",
      npm: "@moneyworks/canonical",
      stats: {
        size: "45KB",
        deps: 1,
        weekly: "1.5K"
      },
      tags: ["types", "schema", "canonical"],
      color: "bg-purple-500",
      dependencies: ["@moneyworks/utilities"],
    },
    {
      name: "@moneyworks/cli",
      version: "0.1.0",
      description: "Command-line interface for testing and interacting with MoneyWorks",
      features: [
        "Data export/import commands",
        "Connection testing",
        "MWScript evaluation",
        "Multiple export formats"
      ],
      icon: <Terminal className="h-6 w-6" />,
      href: "/packages/cli",
      npm: "@moneyworks/cli",
      stats: {
        size: "156KB",
        deps: 5,
        weekly: "320"
      },
      tags: ["cli", "tools", "testing"],
      color: "bg-gray-600",
      dependencies: ["@moneyworks/data", "@moneyworks/canonical"],
    },
    {
      name: "@moneyworks/api",
      version: "0.1.0",
      description: "REST API server for MoneyWorks built with ElysiaJS",
      features: [
        "RESTful endpoints",
        "Swagger documentation",
        "Caching layer",
        "Multiple export formats"
      ],
      icon: <Server className="h-6 w-6" />,
      href: "/packages/api",
      npm: "@moneyworks/api",
      stats: {
        size: "89KB",
        deps: 8,
        weekly: "425"
      },
      tags: ["api", "rest", "server"],
      color: "bg-orange-500",
      dependencies: ["@moneyworks/data", "@moneyworks/canonical"],
    },
    {
      name: "@moneyworks/web1",
      version: "0.1.0",
      description: "Web application for MoneyWorks with React Router v7",
      features: [
        "React Router v7",
        "Tailwind CSS",
        "Authentication",
        "Group management"
      ],
      icon: <Globe className="h-6 w-6" />,
      href: "/packages/web1",
      npm: "@moneyworks/web1",
      stats: {
        size: "2.1MB",
        deps: 24,
        weekly: "180"
      },
      tags: ["web", "react", "ui"],
      color: "bg-cyan-500",
      dependencies: ["@moneyworks/api"],
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              MoneyWorks Core Packages
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A modular ecosystem of TypeScript packages for building robust MoneyWorks integrations. 
              Each package serves a specific purpose and can be used independently or combined for powerful solutions.
            </p>
          </div>

          {/* Quick Install */}
          <div className="mb-12 max-w-4xl mx-auto">
            <div className="rounded-lg bg-gray-900 dark:bg-gray-950 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400">Quick Install</h3>
                <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  Copy all
                </button>
              </div>
              <div className="space-y-2">
                <code className="block text-sm text-gray-300">
                  <span className="text-gray-500"># Install core packages</span>
                </code>
                <code className="block text-sm text-gray-300">
                  bun add @moneyworks/utilities @moneyworks/canonical @moneyworks/data
                </code>
                <code className="block text-sm text-gray-300 mt-4">
                  <span className="text-gray-500"># For API development</span>
                </code>
                <code className="block text-sm text-gray-300">
                  bun add @moneyworks/api
                </code>
              </div>
            </div>
          </div>

          {/* Package Grid */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-12">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className="group relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Color accent bar */}
                <div className={`h-1 ${pkg.color}`} />
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${pkg.color} bg-opacity-10`}>
                        <div className={`${pkg.color} bg-opacity-100 bg-clip-text text-transparent`}>
                          {pkg.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {pkg.name.split('/')[1]}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          v{pkg.version}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {pkg.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      <span>{pkg.stats.size}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitBranch className="h-3 w-3" />
                      <span>{pkg.stats.deps} deps</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{pkg.stats.weekly}/week</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {pkg.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="space-y-1 mb-4">
                    {pkg.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <div className="h-1 w-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dependencies */}
                  {pkg.dependencies && (
                    <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dependencies:</p>
                      <div className="flex flex-wrap gap-1">
                        {pkg.dependencies.map((dep) => (
                          <span
                            key={dep}
                            className="text-xs text-gray-600 dark:text-gray-300"
                          >
                            {dep.split('/')[1]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                    <Link
                      to={pkg.href}
                      className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      Documentation <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                    <a
                      href={`https://www.npmjs.com/package/${pkg.npm}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Package className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dependency Graph */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Package Architecture
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm text-right text-gray-600 dark:text-gray-400">Foundation</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="px-3 py-1 rounded bg-blue-500 bg-opacity-10 text-blue-600 dark:text-blue-400 text-sm">
                      utilities
                    </div>
                    <span className="text-gray-400">→</span>
                    <div className="px-3 py-1 rounded bg-purple-500 bg-opacity-10 text-purple-600 dark:text-purple-400 text-sm">
                      canonical
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm text-right text-gray-600 dark:text-gray-400">Data Layer</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="px-3 py-1 rounded bg-green-500 bg-opacity-10 text-green-600 dark:text-green-400 text-sm">
                      data
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm text-right text-gray-600 dark:text-gray-400">Applications</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="px-3 py-1 rounded bg-orange-500 bg-opacity-10 text-orange-600 dark:text-orange-400 text-sm">
                      api
                    </div>
                    <div className="px-3 py-1 rounded bg-gray-600 bg-opacity-10 text-gray-600 dark:text-gray-400 text-sm">
                      cli
                    </div>
                    <div className="px-3 py-1 rounded bg-cyan-500 bg-opacity-10 text-cyan-600 dark:text-cyan-400 text-sm">
                      web1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6">
              <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Quick Scripts
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Use the CLI package for one-off data exports and automation scripts.
              </p>
              <code className="text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded">
                @moneyworks/cli
              </code>
            </div>
            
            <div className="rounded-lg bg-gradient-to-br from-green-50 to-cyan-50 dark:from-green-900/20 dark:to-cyan-900/20 p-6">
              <Server className="h-8 w-8 text-green-600 dark:text-green-400 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                REST APIs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Build production APIs with authentication and caching.
              </p>
              <code className="text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded">
                @moneyworks/api
              </code>
            </div>
            
            <div className="rounded-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6">
              <Users className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Multi-Company Apps
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Manage multiple companies with the web application.
              </p>
              <code className="text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded">
                @moneyworks/web1
              </code>
            </div>
          </div>

          {/* Philosophy */}
          <div className="max-w-4xl mx-auto">
            <div className="rounded-lg bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Design Philosophy
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">🎯 Single Responsibility</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Each package has one clear purpose and does it well.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">🔗 Composable</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mix and match packages based on your needs.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">📦 Zero Config</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sensible defaults with powerful customization options.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">🚀 Production Ready</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Battle-tested with comprehensive error handling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}