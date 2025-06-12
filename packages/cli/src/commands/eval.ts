import type { MoneyWorksRESTClient } from "@moneyworks/core";

export async function evalCommand(
  client: MoneyWorksRESTClient,
  args: string[],
  _globalOptions: Record<string, unknown>
): Promise<void> {
  if (args.length === 0) {
    console.error("Usage: mw eval <expression>");
    console.error("Example: mw eval \"Count(Account)\"");
    process.exit(1);
  }

  const expression = args.join(" ");

  try {
    console.log(`Evaluating: ${expression}`);
    const result = await client.evaluate(expression);
    console.log(`Result: ${result}`);
  } catch (error) {
    console.error("Evaluation failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}