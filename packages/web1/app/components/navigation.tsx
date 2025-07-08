import { NavLink, useNavigate } from "react-router";
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
  LogOut,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ConnectionSwitcher } from "~/components/connection-switcher";
import { useState, useEffect } from "react";
import { useAuth } from "~/hooks/use-auth";

export function Navigation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isAutomation = import.meta.env.VITE_AUTOMATION === "true";

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
        // Use Clerk's signOut
        await signOut();
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