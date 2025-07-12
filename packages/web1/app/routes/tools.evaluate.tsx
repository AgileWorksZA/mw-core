import { type ActionFunctionArgs, data as json } from "react-router";
import { Form, useActionData, useNavigation } from "react-router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { AuthGuard } from "~/components/auth-guard";
import { requireAuthAndConnection, createMoneyWorksClient } from "~/lib/server-utils";
import {
  Play,
  Copy,
  FileText,
  Code,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const expression = formData.get("expression") as string;

  try {
    const { userId, connection } = await requireAuthAndConnection(request);
    const client = createMoneyWorksClient(connection);
    
    const result = await client.evaluate(expression);
    
    return json({
      result,
      expression,
      error: null,
    });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    return json({
      result: null,
      expression,
      error: error instanceof Error ? error.message : "Evaluation failed",
    });
  }
}

export default function MWScriptEvaluator() {
  return (
    <AuthGuard requireConnection={true}>
      <MWScriptEvaluatorContent />
    </AuthGuard>
  );
}

function MWScriptEvaluatorContent() {
  const { t } = useTranslation();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<Array<{ expression: string; result: any }>>([]);

  const isEvaluating = navigation.state === "submitting";

  useEffect(() => {
    if (actionData && actionData.result) {
      setHistory((prev) => [
        {
          expression: actionData.expression,
          result: actionData.result,
        },
        ...prev.slice(0, 9), // Keep last 10 items
      ]);
    }
  }, [actionData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const exampleExpressions = [
    { label: "Current Date", value: "Today()" },
    { label: "Date Calculation", value: "Today() + 30" },
    { label: "String Function", value: 'Upper("hello world")' },
    { label: "Math Expression", value: "Round(123.456, 2)" },
    { label: "Conditional", value: 'If(1 > 0, "True", "False")' },
  ];

  return (
    <>
      <Navigation />
      <main className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("tools.evaluator")}
          </h1>
          <p className="text-muted-foreground mt-2">
            Test and evaluate MoneyWorks script expressions in real-time
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Evaluator */}
          <div className="lg:col-span-2 space-y-6">
            <Form method="post" className="space-y-4">
              <div className="rounded-lg border bg-card p-6">
                <Label htmlFor="expression" className="text-base font-semibold mb-4 block">
                  {t("tools.expression")}
                </Label>
                <div className="relative">
                  <textarea
                    id="expression"
                    name="expression"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                    placeholder="Enter a MoneyWorks expression..."
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => copyToClipboard(expression)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button type="submit" disabled={isEvaluating || !expression}>
                    <Play className="mr-2 h-4 w-4" />
                    {isEvaluating ? "Evaluating..." : t("tools.evaluate")}
                  </Button>
                </div>
              </div>
            </Form>

            {/* Result Display */}
            {actionData && (
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold">{t("tools.result")}</h2>
                  {actionData.error ? (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
                {actionData.error ? (
                  <div className="rounded-md bg-destructive/10 p-3">
                    <p className="text-sm text-destructive">{actionData.error}</p>
                  </div>
                ) : (
                  <div className="relative">
                    <pre className="overflow-x-auto rounded-md bg-muted p-3 text-sm">
                      <code>{JSON.stringify(actionData.result, null, 2)}</code>
                    </pre>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() =>
                        copyToClipboard(JSON.stringify(actionData.result, null, 2))
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-base font-semibold">Recent History</h2>
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-4 rounded-md border bg-muted/50 p-3 text-sm"
                    >
                      <div className="flex-1 space-y-1">
                        <code className="block font-mono text-xs">
                          {item.expression}
                        </code>
                        <code className="block text-xs text-muted-foreground">
                          → {JSON.stringify(item.result)}
                        </code>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setExpression(item.expression)}
                      >
                        <Code className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Examples */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-base font-semibold">Examples</h3>
              <div className="space-y-2">
                {exampleExpressions.map((example) => (
                  <Button
                    key={example.label}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setExpression(example.value)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {example.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Help */}
            <div className="rounded-lg border bg-muted/50 p-6">
              <h3 className="mb-4 text-base font-semibold">Quick Help</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Common functions:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Date: Today(), Month(), Year()</li>
                  <li>Math: Round(), Abs(), Max(), Min()</li>
                  <li>String: Upper(), Lower(), Trim()</li>
                  <li>Logic: If(), And(), Or(), Not()</li>
                </ul>
                <p className="mt-3">
                  Use expressions to calculate values, transform data, or test
                  business logic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}