import { VariableManagement } from "~/modules/ide/components/variable-management";

export { loader, action } from "~/modules/ide/routes/ide";

export default function IdeVariables() {
  return <VariableManagement />;
}