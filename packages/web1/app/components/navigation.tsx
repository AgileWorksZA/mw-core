import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { UserButton } from "@clerk/clerk-react";
import {
  Home,
  Receipt,
  Building2,
  FolderTree,
  Wrench,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ConnectionSwitcher } from "~/components/connection-switcher";
import { useState, useEffect } from "react";

export function Navigation() {
  const { t } = useTranslation();
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

  const navItems = [
    { to: "/dashboard", label: t("nav.dashboard"), icon: Home },
    { to: "/groups", label: "Groups", icon: FolderTree },
    { to: "/tax-rates", label: t("nav.taxRates"), icon: Receipt },
    { to: "/company", label: t("nav.company"), icon: Building2 },
    { to: "/tools/evaluate", label: t("nav.tools"), icon: Wrench },
    { to: "/settings", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <span className="font-semibold">MoneyWorks</span>
        </div>
        <div className="flex flex-1 items-center space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
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
          {import.meta.env.VITE_AUTOMATION !== "true" && (
            <UserButton afterSignOutUrl="/sign-in" />
          )}
        </div>
      </div>
    </nav>
  );
}