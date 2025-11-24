import {
	Download,
	Globe,
	Monitor,
	Moon,
	Palette,
	RefreshCw,
	Save,
	Sun,
	Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

export default function Settings() {
	const { t, i18n } = useTranslation();
	const [language, setLanguage] = useState(i18n.language);
	const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
	const [hasChanges, setHasChanges] = useState(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme-preference") as
			| "light"
			| "dark"
			| "system"
			| null;
		if (savedTheme) {
			setTheme(savedTheme);
		}
	}, []);

	const handleLanguageChange = (value: string) => {
		setLanguage(value);
		setHasChanges(true);
	};

	const handleThemeChange = (value: "light" | "dark" | "system") => {
		setTheme(value);
		setHasChanges(true);
	};

	const saveSettings = () => {
		// Save language
		i18n.changeLanguage(language);
		localStorage.setItem("language", language);

		// Save theme
		localStorage.setItem("theme-preference", theme);

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			document.documentElement.classList.toggle("dark", systemTheme === "dark");
		} else {
			document.documentElement.classList.toggle("dark", theme === "dark");
		}

		setHasChanges(false);
		toast.success(t("common.success"));
	};

	const sections = [
		{
			title: "Display Settings",
			icon: Palette,
			settings: [
				{
					label: t("settings.language"),
					component: (
						<Select value={language} onValueChange={handleLanguageChange}>
							<SelectTrigger className="w-[200px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="en">English</SelectItem>
								<SelectItem value="af">Afrikaans</SelectItem>
								<SelectItem value="fr">Français</SelectItem>
							</SelectContent>
						</Select>
					),
				},
				{
					label: t("settings.theme"),
					component: (
						<Select value={theme} onValueChange={handleThemeChange}>
							<SelectTrigger className="w-[200px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="light">
									<span className="flex items-center gap-2">
										<Sun className="h-4 w-4" />
										{t("settings.light")}
									</span>
								</SelectItem>
								<SelectItem value="dark">
									<span className="flex items-center gap-2">
										<Moon className="h-4 w-4" />
										{t("settings.dark")}
									</span>
								</SelectItem>
								<SelectItem value="system">
									<span className="flex items-center gap-2">
										<Monitor className="h-4 w-4" />
										{t("settings.system")}
									</span>
								</SelectItem>
							</SelectContent>
						</Select>
					),
				},
			],
		},
	];

	const shortcuts = [
		{ key: "Ctrl/Cmd + K", description: "Quick search" },
		{ key: "Ctrl/Cmd + N", description: "New tax rate" },
		{ key: "Ctrl/Cmd + S", description: "Save changes" },
		{ key: "Esc", description: "Cancel/Close dialog" },
		{ key: "Tab", description: "Navigate fields" },
		{ key: "Enter", description: "Submit form" },
	];

	return (
		<>
			<Navigation />
			<main className="container py-8 max-w-4xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">
						{t("settings.title")}
					</h1>
					<p className="text-muted-foreground mt-2">
						Manage your application preferences and configuration
					</p>
				</div>

				{/* Settings Sections */}
				<div className="space-y-6">
					{sections.map((section) => (
						<div key={section.title} className="rounded-lg border bg-card p-6">
							<div className="mb-6 flex items-center gap-2">
								<section.icon className="h-5 w-5 text-muted-foreground" />
								<h2 className="text-lg font-semibold">{section.title}</h2>
							</div>
							<div className="space-y-4">
								{section.settings.map((setting) => (
									<div
										key={setting.label}
										className="flex items-center justify-between"
									>
										<Label className="text-base">{setting.label}</Label>
										{setting.component}
									</div>
								))}
							</div>
						</div>
					))}

					{/* Data Management */}
					<div className="rounded-lg border bg-card p-6">
						<div className="mb-6 flex items-center gap-2">
							<RefreshCw className="h-5 w-5 text-muted-foreground" />
							<h2 className="text-lg font-semibold">Data Management</h2>
						</div>
						<div className="grid gap-4 sm:grid-cols-3">
							<Button variant="outline">
								<Download className="mr-2 h-4 w-4" />
								Export Settings
							</Button>
							<Button variant="outline">
								<Upload className="mr-2 h-4 w-4" />
								Import Settings
							</Button>
							<Button variant="outline">
								<RefreshCw className="mr-2 h-4 w-4" />
								Reset to Defaults
							</Button>
						</div>
					</div>

					{/* Keyboard Shortcuts */}
					<div className="rounded-lg border bg-card p-6">
						<h2 className="mb-4 text-lg font-semibold">Keyboard Shortcuts</h2>
						<div className="grid gap-3 sm:grid-cols-2">
							{shortcuts.map((shortcut) => (
								<div
									key={shortcut.key}
									className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2"
								>
									<span className="text-sm">{shortcut.description}</span>
									<kbd className="rounded-md bg-background px-2 py-1 text-xs font-mono shadow-sm">
										{shortcut.key}
									</kbd>
								</div>
							))}
						</div>
					</div>

					{/* Save Button */}
					{hasChanges && (
						<div className="sticky bottom-4 flex justify-end">
							<Button onClick={saveSettings} size="lg" className="shadow-lg">
								<Save className="mr-2 h-4 w-4" />
								Save Changes
							</Button>
						</div>
					)}
				</div>
			</main>
		</>
	);
}
