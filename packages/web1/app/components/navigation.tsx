import { UserButton, useClerk } from "@clerk/clerk-react";
import {
	Building2,
	Calculator,
	ChevronDown,
	FolderTree,
	LogOut,
	MessageSquare,
	Moon,
	Receipt,
	Settings,
	Sun,
	Users,
	Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router";
import { ConnectionSwitcher } from "~/components/connection-switcher";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useAuth } from "~/hooks/use-auth";
import { cn } from "~/lib/utils";

export function Navigation() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const isAutomation = import.meta.env.VITE_AUTOMATION === "true";
	// Only use Clerk hooks when not in automation mode
	const { signOut: clerkSignOut } = isAutomation ? { signOut: null } : useClerk();
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
		if (savedTheme) {
			setTheme(savedTheme);
			document.documentElement.classList.toggle("dark", savedTheme === "dark");
		} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			setTheme("dark");
			document.documentElement.classList.add("dark");
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	};

	const handleLogout = async () => {
		try {
			if (isAutomation) {
				// In automation mode, set a flag and redirect to sign-in
				if (typeof window !== "undefined") {
					sessionStorage.setItem("isLoggedOut", "true");
					// Use window.location for a clean navigation
					window.location.href = "/sign-in";
				}
			} else {
				// Use Clerk's signOut with redirect
				if (clerkSignOut) {
					await clerkSignOut({ redirectUrl: "/sign-in" });
				}
			}
		} catch (error) {
			console.error("Logout error:", error);
			// Fallback to window navigation
			if (typeof window !== "undefined") {
				window.location.href = "/sign-in";
			}
		}
	};

	const navItems = [
		{ to: "/chat", label: "Assistant", icon: MessageSquare },
		{ to: "/groups", label: "Groups", icon: FolderTree },
		{ to: "/company", label: t("nav.company"), icon: Building2 },
		{ to: "/tools/evaluate", label: t("nav.tools"), icon: Wrench },
		{ to: "/settings", label: t("nav.settings"), icon: Settings },
	];

	const accountingMenuItems = [
		{ to: "/names", label: "Names", icon: Users },
		{ to: "/tax-rates", label: t("nav.taxRates"), icon: Receipt },
		// Add more accounting menu items here as they're implemented
	];

	// Check if any accounting menu item is active
	const isAccountingActive = accountingMenuItems.some(
		(item) =>
			typeof window !== "undefined" && window.location.pathname === item.to,
	);

	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="mr-4 flex">
					<NavLink
						to="/dashboard"
						className="font-bold text-lg hover:text-primary transition-colors"
					>
						MoneyWorks
					</NavLink>
				</div>
				<div className="flex flex-1 items-center space-x-6">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							className={({ isActive }) =>
								cn(
									"flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
									isActive ? "text-foreground" : "text-muted-foreground",
								)
							}
						>
							<item.icon className="h-4 w-4" />
							{item.label}
						</NavLink>
					))}

					{/* Accounting Dropdown Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className={cn(
									"flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
									isAccountingActive
										? "text-foreground"
										: "text-muted-foreground data-[state=open]:text-foreground",
								)}
							>
								<Calculator className="h-4 w-4" />
								{t("nav.accounting")}
								<ChevronDown className="h-3 w-3 ml-1" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48">
							{accountingMenuItems.map((item) => (
								<DropdownMenuItem
									key={item.to}
									onClick={() => navigate(item.to)}
									className="cursor-pointer"
								>
									<item.icon className="h-4 w-4 mr-2" />
									{item.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="flex items-center gap-4">
					<ConnectionSwitcher />
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleTheme}
						className="h-9 w-9"
					>
						{theme === "dark" ? (
							<Sun className="h-4 w-4" />
						) : (
							<Moon className="h-4 w-4" />
						)}
					</Button>
					{isAutomation ? (
						<Button
							variant="ghost"
							size="icon"
							onClick={handleLogout}
							className="h-9 w-9"
							title="Logout"
						>
							<LogOut className="h-4 w-4" />
						</Button>
					) : (
						<UserButton afterSignOutUrl="/sign-in" />
					)}
				</div>
			</div>
		</nav>
	);
}
