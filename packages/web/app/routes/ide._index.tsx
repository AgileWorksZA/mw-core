/**
 * IDE Home/Dashboard Route
 *
 * This is the landing page of the IDE when no specific file is selected.
 * It now shows a comprehensive dashboard with:
 * - Environment configuration management
 * - Project statistics
 * - Quick actions
 * - Recent files
 *
 * This route uses the same loader and action as the parent IDE route to access
 * the project context. No additional loading is needed since the context is
 * already loaded in the parent route and available through useIde().
 */
import { IDEDashboard } from "~/modules/ide/components/ide-dashboard";
export { loader, action } from "~/modules/ide/routes/ide";

export default function IdeIndex() {
  return <IDEDashboard />;
}
