import { evalCommand } from "@moneyworks/cli/commands/eval";
import { exportCommand } from "@moneyworks/cli/commands/export";
import { importCommand } from "@moneyworks/cli/commands/import";
import { listCommand } from "@moneyworks/cli/commands/list";
import { namesCommand } from "@moneyworks/cli/commands/names";
import { testConnectionCommand } from "@moneyworks/cli/commands/test-connection";
import { versionCommand } from "@moneyworks/cli/commands/version";
import type { SmartMoneyWorksClient } from "@moneyworks/data";

export type CommandHandler = (
	client: SmartMoneyWorksClient,
	args: string[],
	options: Record<string, unknown>,
) => Promise<void>;

export const commands: Record<string, CommandHandler> = {
	export: exportCommand,
	import: importCommand,
	eval: evalCommand,
	version: versionCommand,
	list: listCommand,
	"test-connection": testConnectionCommand,
	names: namesCommand,
};
