import { Command } from "cmdk";
import Fuse from "fuse.js";
import {
	BookOpen,
	Code2,
	Database,
	FileText,
	Globe,
	Hash,
	Package,
	Search,
	Server,
	Terminal,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";

// Comprehensive search data including all packages and API methods
const searchData = [
	// Packages
	{
		id: "pkg-utilities",
		type: "package",
		title: "@moneyworks/utilities",
		description: "Core utilities and branded types",
		url: "/packages/utilities",
		category: "Packages",
		icon: "zap",
	},
	{
		id: "pkg-canonical",
		type: "package",
		title: "@moneyworks/canonical",
		description: "Pure MoneyWorks type definitions",
		url: "/packages/canonical",
		category: "Packages",
		icon: "book",
	},
	{
		id: "pkg-data",
		type: "package",
		title: "@moneyworks/data",
		description: "Data access layer with smart discovery",
		url: "/packages/data",
		category: "Packages",
		icon: "database",
	},
	{
		id: "pkg-cli",
		type: "package",
		title: "@moneyworks/cli",
		description: "Command-line interface",
		url: "/packages/cli",
		category: "Packages",
		icon: "terminal",
	},
	{
		id: "pkg-api",
		type: "package",
		title: "@moneyworks/api",
		description: "REST API server",
		url: "/packages/api",
		category: "Packages",
		icon: "server",
	},
	{
		id: "pkg-web1",
		type: "package",
		title: "@moneyworks/web1",
		description: "Web application",
		url: "/packages/web1",
		category: "Packages",
		icon: "globe",
	},

	// Utilities API Methods
	{
		id: "api-validateYYYYMMDD",
		type: "api",
		title: "validateYYYYMMDD",
		description: "Validate date in YYYYMMDD format",
		url: "/packages/utilities/api#export-date-validators",
		category: "Utilities API",
		icon: "code",
	},
	{
		id: "api-formatYYYYMMDD",
		type: "api",
		title: "formatYYYYMMDD",
		description: "Format Date to YYYYMMDD string",
		url: "/packages/utilities/api#export-formatters",
		category: "Utilities API",
		icon: "code",
	},
	{
		id: "api-parseYYYYMMDD",
		type: "api",
		title: "parseYYYYMMDD",
		description: "Parse YYYYMMDD to Date object",
		url: "/packages/utilities/api#export-date-factory-functions",
		category: "Utilities API",
		icon: "code",
	},
	{
		id: "api-d-template",
		type: "api",
		title: "d`` template literal",
		description: "Tagged template for YYYYMMDD dates",
		url: "/packages/utilities/api#export-tagged-template-literals",
		category: "Utilities API",
		icon: "code",
	},
	{
		id: "api-p-template",
		type: "api",
		title: "p`` template literal",
		description: "Tagged template for periods",
		url: "/packages/utilities/api#export-tagged-template-literals",
		category: "Utilities API",
		icon: "code",
	},
	{
		id: "api-ac-template",
		type: "api",
		title: "ac`` template literal",
		description: "Tagged template for account codes",
		url: "/packages/utilities/api#export-tagged-template-literals",
		category: "Utilities API",
		icon: "code",
	},
	{
		id: "api-parseJSON",
		type: "api",
		title: "parseJSON",
		description: "Parse JSON preserving number precision",
		url: "/packages/utilities/api#export-json-parsing",
		category: "Utilities API",
		icon: "code",
	},
	{
		id: "api-YYYYMMDD",
		type: "api",
		title: "YYYYMMDD type",
		description: "Branded type for MoneyWorks dates",
		url: "/packages/utilities/api#export-branded-types",
		category: "Utilities API",
		icon: "hash",
	},
	{
		id: "api-AccountCode",
		type: "api",
		title: "AccountCode type",
		description: "Branded type for account codes",
		url: "/packages/utilities/api#export-branded-types",
		category: "Utilities API",
		icon: "hash",
	},
	{
		id: "api-Period",
		type: "api",
		title: "Period type",
		description: "Branded type for periods",
		url: "/packages/utilities/api#export-branded-types",
		category: "Utilities API",
		icon: "hash",
	},

	// Data API Methods
	{
		id: "api-createSmartClient",
		type: "api",
		title: "createSmartClient",
		description: "Create client with field discovery",
		url: "/packages/data/api#export-main-entry-points",
		category: "Data API",
		icon: "code",
	},
	{
		id: "api-MoneyWorksClient",
		type: "api",
		title: "MoneyWorksClient",
		description: "Core client for MoneyWorks",
		url: "/packages/data/api#export-client-classes",
		category: "Data API",
		icon: "code",
	},
	{
		id: "api-loadConfig",
		type: "api",
		title: "loadConfig",
		description: "Load configuration from file",
		url: "/packages/data/api#export-main-entry-points",
		category: "Data API",
		icon: "code",
	},
	{
		id: "api-export",
		type: "api",
		title: "export method",
		description: "Export data from MoneyWorks",
		url: "/packages/data/api#export-client-classes",
		category: "Data API",
		icon: "code",
	},
	{
		id: "api-testConnection",
		type: "api",
		title: "testConnection",
		description: "Test MoneyWorks connection",
		url: "/packages/data/api#export-client-classes",
		category: "Data API",
		icon: "code",
	},

	// Canonical API
	{
		id: "api-TaxRates",
		type: "api",
		title: "TaxRates namespace",
		description: "Tax rate calculations and constants",
		url: "/packages/canonical/api#export-taxrates-namespace",
		category: "Canonical API",
		icon: "code",
	},
	{
		id: "api-calculateTax",
		type: "api",
		title: "calculateTax",
		description: "Calculate tax amount",
		url: "/packages/canonical/api#export-taxrates-namespace",
		category: "Canonical API",
		icon: "code",
	},
	{
		id: "api-MoneyWorksTaxRate",
		type: "api",
		title: "MoneyWorksTaxRate type",
		description: "Tax rate interface",
		url: "/packages/canonical/api#export-common-types",
		category: "Canonical API",
		icon: "hash",
	},

	// API Server Methods
	{
		id: "api-createApp",
		type: "api",
		title: "createApp",
		description: "Create ElysiaJS API application",
		url: "/packages/api/api#export-application-factory",
		category: "API Server",
		icon: "code",
	},
	{
		id: "api-BaseTableController",
		type: "api",
		title: "BaseTableController",
		description: "Base controller for tables",
		url: "/packages/api/api#export-controllers",
		category: "API Server",
		icon: "code",
	},
	{
		id: "api-errorHandler",
		type: "api",
		title: "errorHandler",
		description: "Global error handling middleware",
		url: "/packages/api/api#export-middleware",
		category: "API Server",
		icon: "code",
	},
	{
		id: "api-createTableRoutes",
		type: "api",
		title: "createTableRoutes",
		description: "Create routes for table operations",
		url: "/packages/api/api#export-routes",
		category: "API Server",
		icon: "code",
	},

	// Guides
	{
		id: "guide-getting-started",
		type: "guide",
		title: "Getting Started",
		description: "Set up the MoneyWorks Core monorepo",
		url: "/guides/getting-started",
		category: "Guides",
		icon: "book",
	},
	{
		id: "guide-using-cli",
		type: "guide",
		title: "Using the CLI",
		description: "Master the command-line tool",
		url: "/guides/using-the-cli",
		category: "Guides",
		icon: "book",
	},
	{
		id: "guide-api-dev",
		type: "guide",
		title: "API Development",
		description: "Build REST APIs with ElysiaJS",
		url: "/guides/api-development",
		category: "Guides",
		icon: "book",
	},
	{
		id: "guide-type-safety",
		type: "guide",
		title: "Type Safety Guide",
		description: "Understanding branded types",
		url: "/guides/type-safety",
		category: "Guides",
		icon: "book",
	},

	// Common searches
	{
		id: "search-dates",
		type: "search",
		title: "Date handling",
		description: "YYYYMMDD format, validation, parsing",
		url: "/packages/utilities/api#export-date-manipulation",
		category: "Common Topics",
		icon: "search",
	},
	{
		id: "search-export",
		type: "search",
		title: "Export formats",
		description: "full, compact, compact-headers, schema",
		url: "/packages/data/api#export-export-format-converters",
		category: "Common Topics",
		icon: "search",
	},
	{
		id: "search-auth",
		type: "search",
		title: "Authentication",
		description: "Connection setup, credentials",
		url: "/guides/getting-started#environment-variables",
		category: "Common Topics",
		icon: "search",
	},
	{
		id: "search-types",
		type: "search",
		title: "Branded types",
		description: "Type safety with branded types",
		url: "/packages/utilities/api#export-branded-types",
		category: "Common Topics",
		icon: "search",
	},
];

const fuse = new Fuse(searchData, {
	keys: ["title", "description"],
	threshold: 0.3,
});

export function SearchCommand() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const results = search ? fuse.search(search).map((r) => r.item) : [];
	const groupedResults = results.reduce(
		(acc, item) => {
			if (!acc[item.category]) acc[item.category] = [];
			acc[item.category].push(item);
			return acc;
		},
		{} as Record<string, typeof searchData>,
	);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const getIcon = (iconName: string) => {
		switch (iconName) {
			case "zap":
				return <Zap className="h-4 w-4" />;
			case "book":
				return <BookOpen className="h-4 w-4" />;
			case "database":
				return <Database className="h-4 w-4" />;
			case "terminal":
				return <Terminal className="h-4 w-4" />;
			case "server":
				return <Server className="h-4 w-4" />;
			case "globe":
				return <Globe className="h-4 w-4" />;
			case "code":
				return <Code2 className="h-4 w-4" />;
			case "hash":
				return <Hash className="h-4 w-4" />;
			case "search":
				return <Search className="h-4 w-4" />;
			default:
				return <FileText className="h-4 w-4" />;
		}
	};

	if (!open) return null;

	return (
		<Command.Dialog
			open={open}
			onOpenChange={setOpen}
			label="Search documentation"
			className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
		>
			<div
				className="fixed inset-0 bg-black/50"
				onClick={() => setOpen(false)}
			/>
			<div className="relative w-full max-w-2xl overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-2xl">
				<Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 dark:[&_[cmdk-group-heading]]:text-gray-400 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
					<div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-3">
						<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
						<Command.Input
							placeholder="Search documentation..."
							value={search}
							onValueChange={setSearch}
							className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
						/>
						<kbd className="ml-auto text-xs text-gray-500 dark:text-gray-400">
							ESC
						</kbd>
					</div>
					<Command.List className="max-h-[400px] overflow-y-auto p-2">
						<Command.Empty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
							No results found for "{search}"
						</Command.Empty>

						{search.length === 0 && (
							<div className="px-2 py-4">
								<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
									Start typing to search packages, APIs, and guides...
								</p>
								<div className="space-y-4">
									<div>
										<h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
											Popular searches
										</h3>
										<div className="space-y-1">
											{[
												"YYYYMMDD",
												"export",
												"createSmartClient",
												"authentication",
											].map((term) => (
												<button
													key={term}
													onClick={() => setSearch(term)}
													className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
												>
													{term}
												</button>
											))}
										</div>
									</div>
								</div>
							</div>
						)}

						{Object.entries(groupedResults).map(([category, items]) => (
							<Command.Group key={category} heading={category} className="mb-2">
								{items.map((item) => (
									<Command.Item
										key={item.id}
										value={`${item.title} ${item.description}`}
										onSelect={() => {
											setOpen(false);
											setSearch("");

											// Handle navigation with hash
											const [pathname, hash] = item.url.split("#");
											const currentPath = window.location.pathname;

											if (pathname === currentPath && hash) {
												// Same page, just update hash and scroll
												window.location.hash = hash;

												// Manually trigger scroll after a brief delay
												setTimeout(() => {
													const element = document.getElementById(hash);
													if (element) {
														const rect = element.getBoundingClientRect();
														const absoluteTop = window.pageYOffset + rect.top;
														window.scrollTo({
															top: absoluteTop - 80, // Account for header
															behavior: "smooth",
														});
													}
												}, 100);
											} else {
												// Different page, navigate normally
												navigate(item.url);
											}
										}}
										className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
									>
										<div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
											{getIcon(item.icon)}
										</div>
										<div className="flex-1">
											<div className="font-medium text-gray-900 dark:text-white">
												{item.title}
											</div>
											<div className="text-xs text-gray-500 dark:text-gray-400">
												{item.description}
											</div>
										</div>
										<kbd className="ml-auto hidden text-xs text-gray-400 sm:inline">
											↵
										</kbd>
									</Command.Item>
								))}
							</Command.Group>
						))}
					</Command.List>
					<div className="border-t border-gray-200 dark:border-gray-800 px-3 py-2">
						<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
							<div className="flex items-center gap-2">
								<kbd className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5">
									↑↓
								</kbd>
								<span>Navigate</span>
							</div>
							<div className="flex items-center gap-2">
								<kbd className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5">
									↵
								</kbd>
								<span>Select</span>
							</div>
							<div className="flex items-center gap-2">
								<kbd className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5">
									esc
								</kbd>
								<span>Close</span>
							</div>
						</div>
					</div>
				</Command>
			</div>
		</Command.Dialog>
	);
}
