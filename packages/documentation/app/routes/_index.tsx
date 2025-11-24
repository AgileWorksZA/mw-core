import {
	ArrowRight,
	BookOpen,
	Code2,
	Database,
	Globe,
	Package,
	Search,
	Server,
	Terminal,
	Zap,
} from "lucide-react";
import type { MetaFunction } from "react-router";
import { Link } from "react-router";

export const meta: MetaFunction = () => {
	return [
		{ title: "MoneyWorks Core Documentation" },
		{
			name: "description",
			content: "Developer documentation for MoneyWorks Core packages",
		},
	];
};

export default function Index() {
	const packages = [
		{
			name: "@moneyworks/utilities",
			description:
				"Core utilities and branded types for type-safe MoneyWorks development",
			href: "/packages/utilities",
			icon: <Zap className="h-5 w-5" />,
			color: "text-blue-600 dark:text-blue-400",
			bgColor: "bg-blue-50 dark:bg-blue-900/20",
		},
		{
			name: "@moneyworks/canonical",
			description: "Canonical type definitions for MoneyWorks entities",
			href: "/packages/canonical",
			icon: <BookOpen className="h-5 w-5" />,
			color: "text-purple-600 dark:text-purple-400",
			bgColor: "bg-purple-50 dark:bg-purple-900/20",
		},
		{
			name: "@moneyworks/data",
			description:
				"Data access layer for MoneyWorks with smart export capabilities",
			href: "/packages/data",
			icon: <Database className="h-5 w-5" />,
			color: "text-green-600 dark:text-green-400",
			bgColor: "bg-green-50 dark:bg-green-900/20",
		},
		{
			name: "@moneyworks/cli",
			description:
				"Command-line interface for testing and interacting with MoneyWorks",
			href: "/packages/cli",
			icon: <Terminal className="h-5 w-5" />,
			color: "text-orange-600 dark:text-orange-400",
			bgColor: "bg-orange-50 dark:bg-orange-900/20",
		},
		{
			name: "@moneyworks/api",
			description: "REST API server for MoneyWorks built with ElysiaJS",
			href: "/packages/api",
			icon: <Server className="h-5 w-5" />,
			color: "text-red-600 dark:text-red-400",
			bgColor: "bg-red-50 dark:bg-red-900/20",
		},
		{
			name: "@moneyworks/web1",
			description: "Web application for MoneyWorks with React Router v7",
			href: "/packages/web1",
			icon: <Globe className="h-5 w-5" />,
			color: "text-indigo-600 dark:text-indigo-400",
			bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
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
							<div className="flex justify-center">
								<button
									onClick={() => {
										const event = new KeyboardEvent("keydown", {
											key: "k",
											metaKey: true,
											ctrlKey: true,
											bubbles: true,
										});
										document.dispatchEvent(event);
									}}
									className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 transition-colors w-full max-w-sm"
								>
									<Search className="h-4 w-4" />
									<span className="flex-1 text-left">
										Search documentation...
									</span>
									<kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:text-gray-400 opacity-100 sm:flex">
										<span className="text-xs">⌘</span>K
									</kbd>
								</button>
							</div>
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

			{/* Philosophy Section */}
			<section className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
				<div className="container mx-auto px-4 py-20">
					<div className="mx-auto max-w-5xl">
						<h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center mb-12">
							Philosophy & Design Principles
						</h2>

						<div className="prose prose-lg dark:prose-invert mx-auto">
							<p className="lead">
								MoneyWorks Core is built on a foundation of principles that
								guide every decision we make. These aren't just ideals—they're
								practical guidelines that shape our code, APIs, and developer
								experience.
							</p>
						</div>

						<div className="grid gap-8 md:grid-cols-2 mt-12">
							<div className="space-y-8">
								<div>
									<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
										<span className="text-2xl">🎯</span> Developer Experience
										First
									</h3>
									<ul className="space-y-2 text-gray-600 dark:text-gray-400">
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Clear, intuitive APIs</strong> - Method names
												should be self-explanatory
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Comprehensive type safety</strong> - Full
												TypeScript types for all interfaces
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Rich documentation</strong> - Every function has
												examples and clear explanations
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Helpful error messages</strong> - Errors guide
												developers to solutions
											</span>
										</li>
									</ul>
								</div>

								<div>
									<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
										<span className="text-2xl">🤖</span> LLM-Optimized Context
									</h3>
									<ul className="space-y-2 text-gray-600 dark:text-gray-400">
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Self-documenting code</strong> - Code structure
												tells the story
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Explicit schemas</strong> - All data structures
												clearly defined
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Rich metadata</strong> - Include descriptions,
												constraints, relationships
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>AI-friendly comments</strong> - Use
												@ai-instruction and @ai-critical tags
											</span>
										</li>
									</ul>
								</div>

								<div>
									<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
										<span className="text-2xl">🛡️</span> Type Safety & Validation
									</h3>
									<ul className="space-y-2 text-gray-600 dark:text-gray-400">
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Branded types</strong> - YYYYMMDD, AccountCode
												prevent mixing types
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Compile-time safety</strong> - Catch errors
												before runtime
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Runtime validation</strong> - Validate data from
												MoneyWorks
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Clear type hierarchies</strong> - Input types,
												output types, internal types
											</span>
										</li>
									</ul>
								</div>
							</div>

							<div className="space-y-8">
								<div>
									<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
										<span className="text-2xl">📚</span> Canonical MoneyWorks
										DSL
									</h3>
									<ul className="space-y-2 text-gray-600 dark:text-gray-400">
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Preserve MW terminology</strong> - GST stays
												GST, never tax_id
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Use exact field names</strong> - TaxCode, not
												tax_code
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Maintain MW concepts</strong> - RecAccount,
												PaidAccount patterns
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Pure DSL approach</strong> - No contamination
												from other systems
											</span>
										</li>
									</ul>
								</div>

								<div>
									<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
										<span className="text-2xl">⚡</span> Performance &
										Flexibility
									</h3>
									<ul className="space-y-2 text-gray-600 dark:text-gray-400">
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Multiple export formats</strong> - Compact
												arrays to schema-enriched
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Lazy loading</strong> - Field discovery only
												when needed
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Efficient caching</strong> - Cache discovered
												structures
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Extensible design</strong> - New formats can be
												added easily
											</span>
										</li>
									</ul>
								</div>

								<div>
									<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
										<span className="text-2xl">🏗️</span> Progressive Enhancement
									</h3>
									<ul className="space-y-2 text-gray-600 dark:text-gray-400">
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Start simple</strong> - Basic features work
												immediately
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Add complexity gradually</strong> - Advanced
												features when needed
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Backward compatibility</strong> - Never break
												existing code
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary-600 mt-1">•</span>
											<span>
												<strong>Feature discovery</strong> - Clear upgrade paths
											</span>
										</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="mt-16 p-8 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
								Our Commitment
							</h3>
							<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
								These principles aren't just words—they're embedded in every
								line of code we write. When you use MoneyWorks Core, you're not
								just getting a library; you're getting a thoughtfully designed
								ecosystem that respects your time, enhances your productivity,
								and grows with your needs. We believe that great developer tools
								should be a joy to use, and we're committed to maintaining these
								standards as the project evolves.
							</p>
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
								className="group relative rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:border-primary-500 dark:hover:border-primary-400 transition-all hover:shadow-lg overflow-hidden"
							>
								<div className="flex items-center gap-3 mb-3">
									<div
										className={`flex h-10 w-10 items-center justify-center rounded-lg ${pkg.bgColor} ${pkg.color} group-hover:scale-110 transition-transform`}
									>
										{pkg.icon}
									</div>
									<h3 className="font-semibold text-gray-900 dark:text-white">
										{pkg.name.split("/")[1]}
									</h3>
								</div>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{pkg.description}
								</p>
								<div
									className={`mt-4 flex items-center text-sm font-medium ${pkg.color} group-hover:gap-2 transition-all`}
								>
									View docs{" "}
									<ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
								</div>
								{/* Hover gradient effect */}
								<div
									className={`absolute inset-0 ${pkg.bgColor} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`}
								/>
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
								Find what you need quickly with our AI-powered search. Search
								packages, APIs, guides, and code examples.
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
								Learn by doing with live code examples. Edit and run code
								directly in your browser.
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
