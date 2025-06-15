import type { MoneyWorksRESTClient } from "@moneyworks/core";
import { exportCommand } from "./export";
import { importCommand } from "./import";
import { evalCommand } from "./eval";
import { versionCommand } from "./version";
import { listCommand } from "./list";
import { testConnectionCommand } from "./test-connection";

export type CommandHandler = (
  client: MoneyWorksRESTClient,
  args: string[],
  options: Record<string, unknown>
) => Promise<void>;

export const commands: Record<string, CommandHandler> = {
  export: exportCommand,
  import: importCommand,
  eval: evalCommand,
  version: versionCommand,
  list: listCommand,
  "test-connection": testConnectionCommand,
};