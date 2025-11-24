import {
	ArrowRight,
	BookOpen,
	Code2,
	Database,
	Globe,
	Layers,
	Package,
	Server,
	Shield,
	Sparkles,
	Terminal,
	Zap,
} from "lucide-react";
import { Link } from "react-router";
import { HashLink } from "~/components/hash-link";

export default function ApiIndex() {
	const packages = [
		{
			name: "@moneyworks/utilities",
			description:
				"Core utilities and branded types for type-safe MoneyWorks development",
			icon: <Zap className="h-6 w-6" />,
			href: "/packages/utilities/api",
			highlights: [
				"Branded types (YYYYMMDD, AccountCode)",
				"Date utilities with fluent API",
				"JSON parsing with type preservation",
				"Tagged template literals",
			],
			color: "text-blue-600 dark:text-blue-400",
			bgColor: "bg-blue-50 dark:bg-blue-900/20",
		},
		{
			name: "@moneyworks/canonical",
			description: "Pure MoneyWorks type definitions and business logic",
			icon: <BookOpen className="h-6 w-6" />,
			href: "/packages/canonical/api",
			highlights: [
				"MoneyWorks entity types",
				"Tax rate calculations",
				"Business rule constants",
				"Type-safe enums",
			],
			color: "text-purple-600 dark:text-purple-400",
			bgColor: "bg-purple-50 dark:bg-purple-900/20",
		},
		{
			name: "@moneyworks/data",
			description: "Data access layer with smart field discovery",
			icon: <Database className="h-6 w-6" />,
			href: "/packages/data/api",
			highlights: [
				"Smart client with auto-discovery",
				"Multiple export formats",
				"Connection management",
				"Field mapping utilities",
			],
			color: "text-green-600 dark:text-green-400",
			bgColor: "bg-green-50 dark:bg-green-900/20",
		},
		{
			name: "@moneyworks/cli",
			description: "Command-line interface for testing and automation",
			icon: <Terminal className="h-6 w-6" />,
			href: "/packages/cli/api",
			highlights: [
				"Export command with formats",
				"Interactive shell",
				"Configuration management",
				"Automation utilities",
			],
			color: "text-orange-600 dark:text-orange-400",
			bgColor: "bg-orange-50 dark:bg-orange-900/20",
		},
		{
			name: "@moneyworks/api",
			description: "REST API server built with ElysiaJS",
			icon: <Server className="h-6 w-6" />,
			href: "/packages/api/api",
			highlights: [
				"RESTful endpoints",
				"Swagger documentation",
				"Middleware system",
				"Caching strategies",
			],
			color: "text-red-600 dark:text-red-400",
			bgColor: "bg-red-50 dark:bg-red-900/20",
		},
		{
			name: "@moneyworks/web1",
			description: "Modern web application with React Router v7",
			icon: <Globe className="h-6 w-6" />,
			href: "/packages/web1/api",
			highlights: [
				"React components",
				"Authentication hooks",
				"Connection management",
				"UI component library",
			],
			color: "text-indigo-600 dark:text-indigo-400",
			bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
		},
	];

	const coreAPIs = [
		{
			title: "Type System",
			icon: <Shield className="h-5 w-5" />,
			description: "Branded types, validation, and type guards",
			links: [
				{
					label: "Branded Types",
					href: "/packages/utilities/api#export-branded-types",
				},
				{
					label: "Date Validators",
					href: "/packages/utilities/api#export-date-validators",
				},
				{
					label: "Tagged Templates",
					href: "/packages/utilities/api#export-tagged-template-literals",
				},
			],
		},
		{
			title: "Data Access",
			icon: <Layers className="h-5 w-5" />,
			description: "Clients, repositories, and export formats",
			links: [
				{
					label: "Client Classes",
					href: "/packages/data/api#export-client-classes",
				},
				{
					label: "Field Discovery",
					href: "/packages/data/api#export-field-discovery",
				},
				{
					label: "Export Formats",
					href: "/packages/data/api#export-export-format-converters",
				},
			],
		},
		{
			title: "Business Logic",
			icon: <Sparkles className="h-5 w-5" />,
			description: "MoneyWorks-specific calculations and rules",
			links: [
				{
					label: "Tax Calculations",
					href: "/packages/canonical/api#export-taxrates-namespace",
				},
				{
					label: "Date Operations",
					href: "/packages/utilities/api#export-date-utilities",
				},
				{
					label: "Constants",
					href: "/packages/canonical/api#export-package-constants",
				},
			],
		},
	];

	return (
		<div className="min-h-screen">
			{/* Header Section */}
			<section className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
				<div className="container mx-auto px-4 py-16">
					<div className="mx-auto max-w-4xl text-center">
						<div className="flex justify-center mb-6">
							<div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
								<Code2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
							</div>
						</div>
						<h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
							API Reference
						</h1>
						<p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
							Complete API documentation for all MoneyWorks Core packages
						</p>

						{/* Quick Search Hint */}
						<div className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm">
							<kbd className="rounded bg-white dark:bg-gray-700 px-2 py-1 text-xs font-semibold">
								⌘K
							</kbd>
							<span className="text-gray-600 dark:text-gray-400">
								to search APIs
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Core APIs Quick Links */}
			<section className="py-12 bg-gray-50 dark:bg-gray-900/50">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-6xl">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
							Core APIs
						</h2>
						<div className="grid gap-6 md:grid-cols-3">
							{coreAPIs.map((api) => (
								<div
									key={api.title}
									className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
								>
									<div className="flex items-center gap-3 mb-4">
										<div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400">
											{api.icon}
										</div>
										<h3 className="font-semibold text-gray-900 dark:text-white">
											{api.title}
										</h3>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
										{api.description}
									</p>
									<div className="space-y-2">
										{api.links.map((link) => (
											<HashLink
												key={link.href}
												to={link.href}
												className="block text-sm text-primary-600 dark:text-primary-400 hover:underline"
											>
												{link.label} →
											</HashLink>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Package APIs */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-6xl">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
							Package APIs
						</h2>

						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{packages.map((pkg) => (
								<Link
									key={pkg.name}
									to={pkg.href}
									className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:border-primary-500 dark:hover:border-primary-400 transition-all hover:shadow-lg"
								>
									{/* Icon and Title */}
									<div className="flex items-start gap-4 mb-4">
										<div
											className={`p-3 rounded-lg ${pkg.bgColor} ${pkg.color} group-hover:scale-110 transition-transform`}
										>
											{pkg.icon}
										</div>
										<div className="flex-1">
											<h3 className="font-semibold text-gray-900 dark:text-white">
												{pkg.name.split("/")[1]}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
												{pkg.description}
											</p>
										</div>
									</div>

									{/* Highlights */}
									<ul className="space-y-2 mb-4">
										{pkg.highlights.map((highlight, i) => (
											<li
												key={i}
												className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
											>
												<span
													className={`mt-1.5 w-1.5 h-1.5 rounded-full ${pkg.bgColor} flex-shrink-0`}
												/>
												<span>{highlight}</span>
											</li>
										))}
									</ul>

									{/* View Documentation Link */}
									<div
										className={`flex items-center text-sm font-medium ${pkg.color} group-hover:gap-3 transition-all`}
									>
										View API docs
										<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
									</div>

									{/* Hover gradient effect */}
									<div
										className={`absolute inset-0 ${pkg.bgColor} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`}
									/>
								</Link>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Quick Start Section */}
			<section className="border-t border-gray-200 dark:border-gray-800 py-16 bg-gray-50 dark:bg-gray-900/50">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-4xl">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
							Quick Start Examples
						</h2>

						<div className="grid gap-6 md:grid-cols-2">
							<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
								<h3 className="font-semibold text-gray-900 dark:text-white mb-3">
									Basic Data Export
								</h3>
								<pre className="text-sm bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto">
									<code>{`import { createSmartClient } from '@moneyworks/data';

const client = createSmartClient(config);
const taxRates = await client.export('TaxRate', {
  format: 'full',
  filter: 'Inactive = false'
});`}</code>
								</pre>
							</div>

							<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
								<h3 className="font-semibold text-gray-900 dark:text-white mb-3">
									Type-Safe Dates
								</h3>
								<pre className="text-sm bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto">
									<code>{`import { d, formatYYYYMMDD } from '@moneyworks/utilities';

// Tagged template literal
const date = d\`20241215\`;

// Format JS Date
const today = formatYYYYMMDD(new Date());`}</code>
								</pre>
							</div>
						</div>

						<div className="mt-8 text-center">
							<Link
								to="/guides/getting-started"
								className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
							>
								View Full Guide
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
