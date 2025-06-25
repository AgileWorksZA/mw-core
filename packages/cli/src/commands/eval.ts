import type { SmartMoneyWorksClient } from "@moneyworks/data";

export async function evalCommand(
  client: SmartMoneyWorksClient,
  args: string[],
  _globalOptions: Record<string, unknown>
): Promise<void> {
  const timing = _globalOptions.timing as boolean;
  if (args.length === 0) {
    console.error("Usage: mw eval <expression>");
    console.error("Example: mw eval \"Count(TaxRate)\"");
    process.exit(1);
  }

  const expression = args.join(" ");

  try {
    console.log(`Evaluating: ${expression}`);
    
    const evalStart = timing ? performance.now() : 0;
    const result = await client.evaluate(expression);
    
    if (timing) {
      const evalEnd = performance.now();
      console.error(`[Timing] Evaluation took: ${(evalEnd - evalStart).toFixed(2)}ms`);
    }
    
    console.log(`Result: ${result}`);
  } catch (error) {
    console.error("Evaluation failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}