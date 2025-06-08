import { useState } from "react";
import { VariableInput } from "~/components/ui/variable-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";

export default function VariableInputNarrowDemo() {
  const [value, setValue] = useState("This is a very long URL with multiple variables: {{base_url}}/api/{{version}}/organizations/{{organization_id}}/projects/{{project_id}}/environments/{{environment}}/deployments?region={{region}}&debug={{debug_mode}}");

  const variables = {
    base_url: "https://api.example.com",
    version: "v1",
    organization_id: "org-123",
    project_id: "proj-456",
    environment: "production",
    region: "us-west-2",
    debug_mode: "false",
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Variable Input - Narrow Container Test</h1>
      
      <div className="grid gap-6">
        {/* Very narrow container */}
        <Card>
          <CardHeader>
            <CardTitle>200px Wide Container</CardTitle>
            <CardDescription>
              Testing scrolling in a very narrow parent container
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-[200px] border-2 border-dashed border-gray-300 p-4">
              <Label>Narrow Input</Label>
              <VariableInput
                value={value}
                onChange={setValue}
                variables={variables}
                placeholder="Long text..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Medium container */}
        <Card>
          <CardHeader>
            <CardTitle>400px Wide Container</CardTitle>
            <CardDescription>
              Testing scrolling in a medium-width parent container
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-[400px] border-2 border-dashed border-gray-300 p-4">
              <Label>Medium Input</Label>
              <VariableInput
                value={value}
                onChange={setValue}
                variables={variables}
                placeholder="Long text..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Nested narrow containers */}
        <Card>
          <CardHeader>
            <CardTitle>Nested Narrow Containers</CardTitle>
            <CardDescription>
              Testing scrolling with multiple levels of narrow containers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-[500px] border-2 border-dashed border-blue-300 p-4 overflow-x-auto">
              <div className="w-[300px] border-2 border-dashed border-green-300 p-4">
                <Label>Nested Input</Label>
                <VariableInput
                  value={value}
                  onChange={setValue}
                  variables={variables}
                  placeholder="Long text..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test with preview mode */}
        <Card>
          <CardHeader>
            <CardTitle>Preview Mode in Narrow Container</CardTitle>
            <CardDescription>
              Testing preview mode with resolved values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-[350px] border-2 border-dashed border-gray-300 p-4">
              <Label>Preview Mode</Label>
              <VariableInput
                value={value}
                onChange={setValue}
                variables={variables}
                preview={true}
                placeholder="Long text..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-muted rounded">
        <p className="text-sm text-muted-foreground">
          The input should scroll horizontally within itself without causing the page or parent containers to scroll.
        </p>
      </div>
    </div>
  );
}