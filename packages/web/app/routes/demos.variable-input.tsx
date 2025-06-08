import { useState } from "react";
import { VariableInput } from "~/components/ui/variable-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";

export default function VariableInputDemo() {
  const [value1, setValue1] = useState("API URL: {{base_url}}/api/{{version}}/users");
  const [value2, setValue2] = useState("Auth: Bearer {{api_token}}");
  const [value3, setValue3] = useState("Missing var: {{missing_variable}}");
  const [clickedVariable, setClickedVariable] = useState<string | null>(null);

  // Example variables
  const availableVariables = {
    base_url: "https://api.example.com",
    version: "v1",
    api_token: "secret-token-123",
    api_secret: "super-secret-key",
    environment: "production",
    region: "us-west-2",
    debug_mode: "false",
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Variable Input Component</h1>
        <p className="text-muted-foreground">
          An intelligent input that highlights variables using the {"{{notation}}"} syntax.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Basic Example */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Variable Input</CardTitle>
            <CardDescription>
              Variables are highlighted in green if they exist, red if they don't.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input1">API Endpoint Configuration</Label>
              <VariableInput
                id="input1"
                value={value1}
                onChange={setValue1}
                variables={availableVariables}
                placeholder="Enter URL with variables..."
              />
              <p className="text-sm text-muted-foreground">
                Current value: <code className="text-xs bg-muted px-1 py-0.5 rounded">{value1}</code>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="input2">Authorization Header</Label>
              <VariableInput
                id="input2"
                value={value2}
                onChange={setValue2}
                variables={availableVariables}
                placeholder="Enter auth header..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="input3">Example with Missing Variable</Label>
              <VariableInput
                id="input3"
                value={value3}
                onChange={setValue3}
                variables={availableVariables}
                placeholder="Enter text with variables..."
              />
              <p className="text-sm text-muted-foreground">
                The variable <code>{"{{missing_variable}}"}</code> doesn't exist and is shown in red.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Example */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Variables</CardTitle>
            <CardDescription>
              Click on variables to see their values.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input4">Click on Variables</Label>
              <VariableInput
                id="input4"
                defaultValue="Base: {{base_url}}, Token: {{api_token}}, Region: {{region}}"
                variables={availableVariables}
                onVariableClick={setClickedVariable}
                placeholder="Enter text with clickable variables..."
              />
              {clickedVariable && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    <span className="font-medium">Clicked variable:</span>{" "}
                    <code>{clickedVariable}</code>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Value:</span>{" "}
                    <code>{availableVariables[clickedVariable as keyof typeof availableVariables] || "undefined"}</code>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Available Variables */}
        <Card>
          <CardHeader>
            <CardTitle>Available Variables</CardTitle>
            <CardDescription>
              These variables are available for use in the inputs above.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(availableVariables).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="font-mono">
                  <span className="text-green-600 dark:text-green-400">{`{{${key}}}`}</span>
                  <span className="mx-2 text-muted-foreground">=</span>
                  <span>{value}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* No Variables Example */}
        <Card>
          <CardHeader>
            <CardTitle>Without Variable Context</CardTitle>
            <CardDescription>
              When no variables are provided, all variables are shown in blue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="input5">No Variable Validation</Label>
              <VariableInput
                id="input5"
                defaultValue="Config: {{any_variable}} - Status: {{another_variable}}"
                placeholder="Variables shown in blue when no context provided..."
              />
              <p className="text-sm text-muted-foreground">
                This is useful when you're just editing templates without a specific environment context.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Long Text Example */}
        <Card>
          <CardHeader>
            <CardTitle>Scrolling Support</CardTitle>
            <CardDescription>
              The highlighting follows along when the input scrolls.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="input6">Long Text with Scrolling</Label>
              <VariableInput
                id="input6"
                defaultValue="This is a very long URL with multiple variables: {{base_url}}/api/{{version}}/organizations/{{organization_id}}/projects/{{project_id}}/environments/{{environment}}/deployments?region={{region}}&debug={{debug_mode}}"
                variables={availableVariables}
                placeholder="Long text with horizontal scrolling..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview Mode Example */}
        <Card>
          <CardHeader>
            <CardTitle>Preview Mode</CardTitle>
            <CardDescription>
              Show actual values instead of variable names. Secrets are masked as ***.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input7">Normal Mode</Label>
              <VariableInput
                id="input7"
                defaultValue="URL: {{base_url}}/{{version}} | Token: {{api_token}} | Secret: {{api_secret}}"
                variables={availableVariables}
                placeholder="Normal mode shows variable names..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input8">Preview Mode (preview=true)</Label>
              <VariableInput
                id="input8"
                defaultValue="URL: {{base_url}}/{{version}} | Token: {{api_token}} | Secret: {{api_secret}}"
                variables={availableVariables}
                preview={true}
                placeholder="Preview mode shows actual values..."
              />
              <p className="text-sm text-muted-foreground">
                Notice how <code>{"{{api_secret}}"}</code> is shown as *** because it's detected as a sensitive value.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tooltips Example */}
        <Card>
          <CardHeader>
            <CardTitle>Tooltips on Hover</CardTitle>
            <CardDescription>
              Hover over any variable to see its value in a tooltip.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="input9">Hover over variables</Label>
              <VariableInput
                id="input9"
                defaultValue="Try hovering: {{base_url}}, {{api_token}}, {{missing_var}}"
                variables={availableVariables}
                placeholder="Hover over variables to see tooltips..."
              />
              <p className="text-sm text-muted-foreground">
                Tooltips show the variable name and its current value. Missing variables show an error message.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}