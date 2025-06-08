/**
 * Main IDE Layout Route
 *
 * This is the primary container for the entire IDE interface. It sets up the layout with:
 * - A side panel containing the file tree navigation
 * - A main content area showing the active route via Outlet
 *
 * The loader loads the project context from the file system via the store-kit module,
 * which contains all files, their metadata (path, id, type), and the file order.
 *
 * The action handles:
 * - POST: Updates to the project context
 * - DELETE: Deleting the entire project (rarely used)
 */
import { Outlet } from "react-router";
import { loader, action } from "~/modules/ide/routes/ide";
import { Provider } from "~/modules/ide/provider/provider";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "~/components/ui/resizable";
import { FileTree } from "~/modules/ide/components/file-tree";
import { Button } from "~/components/ui/button";
import { useIdeTrigger } from "~/modules/ide/hooks/use-ide-trigger";
import { useIde } from "~/modules/ide/hooks/use-ide";
import { useIdeMemory } from "~/modules/ide/hooks/use-ide-memory";
import { ThemeSwitcher } from "~/components/theme-switcher";
import { EnvironmentSelector } from "~/modules/environment";

export function Debug() {
  const project = useIde();
  const memory = useIdeMemory();
  const trigger = useIdeTrigger();

  const handleRandomDebug = () => {
    trigger.update({
      context: {
        debug: Math.random(),
      } as any,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-bold">Debug</h2>
      <pre>{JSON.stringify(project, null, 2)}</pre>
      <Button type="button" onClick={handleRandomDebug}>
        Random Debug
      </Button>
      <h2 className="text-lg font-bold">Memory</h2>
      <p>{Intl.NumberFormat("en-US").format(memory / 1024)} KB</p>
    </div>
  );
}

const debug = false; // Set to true to enable debug mode

export default function IDE() {
  return (
    <Provider>
      <div className="h-screen flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h1 className="text-lg font-semibold">IDE</h1>
          <div className="flex items-center gap-4">
            <EnvironmentSelector variant="compact" showManageButton />
            <ThemeSwitcher />
          </div>
        </div>
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <FileTree />
            {debug && <Debug />}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            <div className="h-full p-4 overflow-auto">
              <Outlet />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Provider>
  );
}

export { loader, action };
