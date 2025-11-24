import { ArrowRight, BookOpen, Rocket, Shield, Users } from "lucide-react";
import { Link } from "react-router";

export default function GuidesIndex() {
	const guides = [
		{
			title: "Getting Started",
			description: "Learn how to set up MoneyWorks Core in your project",
			icon: <Rocket className="h-5 w-5" />,
			href: "/guides/getting-started",
		},
		{
			title: "Authentication",
			description: "Implement secure authentication with Clerk",
			icon: <Shield className="h-5 w-5" />,
			href: "/guides/authentication",
		},
		{
			title: "Working with Groups",
			description: "Organize companies into groups for accounting firms",
			icon: <Users className="h-5 w-5" />,
			href: "/guides/groups",
		},
		{
			title: "API Development",
			description: "Build robust APIs with MoneyWorks Core",
			icon: <BookOpen className="h-5 w-5" />,
			href: "/guides/api-development",
		},
		{
			title: "Type Safety",
			description: "Leverage TypeScript for bulletproof integrations",
			icon: <Shield className="h-5 w-5" />,
			href: "/guides/type-safety",
		},
	];

	return (
		<div className="min-h-screen py-12">
			<div className="container mx-auto px-4">
				<div className="mx-auto max-w-4xl">
					<div className="mb-12">
						<h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
							Guides
						</h1>
						<p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
							Step-by-step tutorials and best practices for building with
							MoneyWorks Core.
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{guides.map((guide) => (
							<Link
								key={guide.href}
								to={guide.href}
								className="group rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:border-primary-500 dark:hover:border-primary-400 transition-all"
							>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
									{guide.icon}
								</div>
								<h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
									{guide.title}
								</h2>
								<p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
									{guide.description}
								</p>
								<div className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400">
									Read guide <ArrowRight className="ml-1 h-4 w-4" />
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
