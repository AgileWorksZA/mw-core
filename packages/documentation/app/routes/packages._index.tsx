import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { Package, Code2, Database, Globe, ArrowRight, Terminal } from "lucide-react";

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
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Packages
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              MoneyWorks Core is organized into focused, composable packages. Each package 
              has a specific purpose and can be used independently or together.
            </p>
          </div>

          <div className="space-y-6">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className="group relative rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:border-primary-500 dark:hover:border-primary-400 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 shrink-0">
                    {pkg.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {pkg.name}
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        v{pkg.version}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {pkg.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Link
                      to={pkg.href}
                      className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      View documentation <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Package Philosophy
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Each package in MoneyWorks Core follows the single responsibility principle. 
              They are designed to work together seamlessly while maintaining clear boundaries. 
              This approach ensures better maintainability, easier testing, and the flexibility 
              to use only what you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}