import { SecretManagement } from "~/modules/ide/components/secret-management";

export { loader, action } from "~/modules/ide/routes/ide";

export default function IdeSecrets() {
  return <SecretManagement />;
}