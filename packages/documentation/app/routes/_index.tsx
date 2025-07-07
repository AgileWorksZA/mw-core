import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { Search, BookOpen, Package, Code2, ArrowRight, Terminal, Server } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "MoneyWorks Core Documentation" },
    { name: "description", content: "Developer documentation for MoneyWorks Core packages" },
  ];
};

export default function Index() {
  const packages = [
    {
      name: "@moneyworks/utilities",
      description: "Core utilities and branded types for type-safe MoneyWorks development",
      href: "/packages/utilities",
      icon: <Code2 className="h-5 w-5" />,
    },
    {
      name: "@moneyworks/canonical",
      description: "Canonical type definitions for MoneyWorks entities",
      href: "/packages/canonical",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "@moneyworks/data",
      description: "Data access layer for MoneyWorks with smart export capabilities",
      href: "/packages/data",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "@moneyworks/cli",
      description: "Command-line interface for testing and interacting with MoneyWorks",
      href: "/packages/cli",
      icon: <Terminal className="h-5 w-5" />,
    },
    {
      name: "@moneyworks/api",
      description: "REST API server for MoneyWorks built with ElysiaJS",
      href: "/packages/api",
      icon: <Server className="h-5 w-5" />,
    },
    {
      name: "@moneyworks/web1",
      description: "Web application for MoneyWorks with React Router v7",
      href: "/packages/web1",
      icon: <Package className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              MoneyWorks Core
              <span className="block text-primary-600">Documentation</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Build robust accounting integrations with MoneyWorks. Type-safe, 
              well-documented, and designed for enterprise scale.
            </p>
            
            {/* Search Bar */}
            <div className="mt-10">
              {/* SearchCommand will be added later */}
            </div>
            
            {/* Quick Links */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/guides/getting-started"
                className="rounded-md bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Get Started
              </Link>
              <Link
                to="/api"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white flex items-center gap-2"
              >
                API Reference <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Package Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Explore Packages
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              MoneyWorks Core is organized into focused, composable packages
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <Link
                key={pkg.name}
                to={pkg.href}
                className="group relative rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:border-primary-500 dark:hover:border-primary-400 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                    {pkg.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {pkg.name.split('/')[1]}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {pkg.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary-600 dark:text-primary-400">
                  View docs <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-gray-200 dark:border-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-3 max-w-6xl mx-auto">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Smart Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Find what you need quickly with our AI-powered search. Search packages, 
                APIs, guides, and code examples.
              </p>
            </div>
            
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mb-4">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Interactive Examples
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn by doing with live code examples. Edit and run code directly 
                in your browser.
              </p>
            </div>
            
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Comprehensive Guides
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                From getting started to advanced patterns, our guides cover 
                real-world scenarios.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}