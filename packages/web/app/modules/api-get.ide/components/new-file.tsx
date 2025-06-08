import * as React from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { SelectFileByType } from "~/modules/ide/components/select-file-by-type";
import { useIdeTrigger } from "~/modules/ide/hooks/use-ide-trigger";
import type { ApiGetConfig } from "../types";

export function NewFile() {
  const navigate = useNavigate();
  const { createFile } = useIdeTrigger();
  const [isCreating, setIsCreating] = React.useState(false);
  
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    openApiFile: "",
    serviceConnection: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.openApiFile) {
      newErrors.openApiFile = "OpenAPI file is required";
    }
    
    if (!formData.serviceConnection) {
      newErrors.serviceConnection = "Service connection is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsCreating(true);
    
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      const config: ApiGetConfig = {
        id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        version: "1.0.0",
        createdAt: now,
        updatedAt: now,
        sources: {
          openApiFile: formData.openApiFile,
          serviceConnection: formData.serviceConnection,
        },
        endpoint: {
          path: "",
          method: "get",
        },
        parameters: {},
        response: {},
        output: {
          data: `${formData.name.toLowerCase().replace(/\s+/g, "_")}_data`,
        },
      };
      
      const fileName = `${formData.name.toLowerCase().replace(/\s+/g, "-")}.api-get`;
      await createFile("api-get", fileName, { data: config });
      // Navigate will be handled by the create file trigger
    } catch (error) {
      console.error("Failed to create API Get configuration:", error);
      setErrors({ submit: "Failed to create configuration. Please try again." });
      setIsCreating(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create API Get Configuration</CardTitle>
          <CardDescription>
            Configure a GET endpoint from an OpenAPI specification to use as a data source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Get User List"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this API endpoint does..."
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <SelectFileByType
                fileType="openapi"
                value={formData.openApiFile}
                onValueChange={(value) => setFormData({ ...formData, openApiFile: value })}
                label="OpenAPI Specification"
                placeholder="Select an OpenAPI file..."
                required
                className={errors.openApiFile ? "[&_button]:border-destructive" : ""}
              />
              {errors.openApiFile && (
                <p className="text-sm text-destructive">{errors.openApiFile}</p>
              )}

              <SelectFileByType
                fileType="serviceconnection"
                value={formData.serviceConnection}
                onValueChange={(value) => setFormData({ ...formData, serviceConnection: value })}
                label="Service Connection"
                placeholder="Select a service connection..."
                required
                className={errors.serviceConnection ? "[&_button]:border-destructive" : ""}
              />
              {errors.serviceConnection && (
                <p className="text-sm text-destructive">{errors.serviceConnection}</p>
              )}
            </div>

            {errors.submit && (
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/ide")}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Configuration"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}