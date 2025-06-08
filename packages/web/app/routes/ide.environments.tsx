import { EnvironmentManagement } from "~/modules/ide/components/environment-management";

export { loader, action } from "~/modules/ide/routes/ide";

export default function IdeEnvironments() {
  return <EnvironmentManagement />;
}