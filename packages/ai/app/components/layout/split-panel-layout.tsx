/**
 * Split Panel Layout Component
 *
 * Provides a responsive split-panel layout for chat + artifacts.
 * Desktop: 60% chat (left) / 40% artifacts (right)
 * Mobile (<768px): Full-width chat with drawer overlay for artifacts
 */

import { useState, useEffect, type ReactNode } from "react";
import { PanelLeftClose, PanelRightClose, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

interface SplitPanelLayoutProps {
  /** Content for the left (chat) panel */
  leftPanel: ReactNode;
  /** Content for the right (artifacts) panel */
  rightPanel: ReactNode;
  /** Whether to show the right panel */
  showRightPanel?: boolean;
  /** Callback when right panel visibility changes */
  onRightPanelToggle?: (visible: boolean) => void;
  /** Custom class name for the container */
  className?: string;
}

export function SplitPanelLayout({
  leftPanel,
  rightPanel,
  showRightPanel = true,
  onRightPanelToggle,
  className,
}: SplitPanelLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(!showRightPanel);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync with external showRightPanel prop
  useEffect(() => {
    setIsCollapsed(!showRightPanel);
  }, [showRightPanel]);

  const handleToggle = () => {
    if (isMobile) {
      setShowMobileDrawer(!showMobileDrawer);
    } else {
      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);
      onRightPanelToggle?.(!newCollapsed);
    }
  };

  const handleCloseDrawer = () => {
    setShowMobileDrawer(false);
  };

  // Mobile layout with drawer
  if (isMobile) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        {/* Main content (chat) */}
        <div className="h-full w-full">
          {leftPanel}
        </div>

        {/* Toggle button for mobile */}
        {showRightPanel && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggle}
            className="fixed bottom-20 right-4 z-40 rounded-full shadow-lg bg-background"
            aria-label="Show artifacts"
          >
            <PanelRightClose className="size-5" />
          </Button>
        )}

        {/* Mobile drawer overlay */}
        {showMobileDrawer && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={handleCloseDrawer}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-xl animate-in slide-in-from-right duration-300">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b p-4">
                  <h2 className="text-lg font-semibold">Artifacts</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseDrawer}
                    aria-label="Close artifacts"
                  >
                    <X className="size-5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-auto">
                  {rightPanel}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Desktop layout with side panel
  return (
    <div className={cn("flex h-full w-full", className)}>
      {/* Left panel (chat) - expands when right is collapsed */}
      <div
        className={cn(
          "h-full transition-all duration-300 ease-in-out",
          isCollapsed ? "w-full" : "w-[60%]"
        )}
      >
        {leftPanel}
      </div>

      {/* Collapse/expand toggle */}
      {showRightPanel && (
        <div className="relative flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="absolute -left-3 z-10 rounded-full border bg-background shadow-sm hover:bg-muted"
            aria-label={isCollapsed ? "Show artifacts" : "Hide artifacts"}
          >
            {isCollapsed ? (
              <PanelRightClose className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </div>
      )}

      {/* Right panel (artifacts) */}
      <div
        className={cn(
          "h-full border-l transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "w-0 border-l-0" : "w-[40%]"
        )}
      >
        {!isCollapsed && (
          <div className="h-full w-full overflow-auto">
            {rightPanel}
          </div>
        )}
      </div>
    </div>
  );
}
