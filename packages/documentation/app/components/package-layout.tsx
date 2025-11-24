import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

interface NavigationItem {
	title: string;
	href: string;
}

interface PackageLayoutProps {
	children: React.ReactNode;
	navigation: NavigationItem[];
	title: string;
	description?: string;
}

export function PackageLayout({
	children,
	navigation,
	title,
	description,
}: PackageLayoutProps) {
	const location = useLocation();

	return (
		<div className="min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<div className="flex gap-8">
					{/* Sidebar navigation */}
					<aside className="w-64 shrink-0">
						<div className="sticky top-24">
							<h2 className="mb-4 text-lg font-semibold">{title}</h2>
							{description && (
								<p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
									{description}
								</p>
							)}
							<nav className="space-y-1">
								{navigation.map((item) => (
									<Link
										key={item.href}
										to={item.href}
										className={cn(
											"block rounded-md px-3 py-2 text-sm font-medium transition-colors",
											location.pathname === item.href
												? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
												: "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
										)}
									>
										{item.title}
									</Link>
								))}
							</nav>
						</div>
					</aside>

					{/* Main content */}
					<main className="flex-1 max-w-4xl">
						<article className="prose prose-gray dark:prose-invert max-w-none">
							{children}
						</article>
					</main>
				</div>
			</div>
		</div>
	);
}
