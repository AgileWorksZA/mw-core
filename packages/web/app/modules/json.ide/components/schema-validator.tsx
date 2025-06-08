import React, { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import type { JSONSchemaType } from "ajv";
import type {
  JsonSchema,
  JsonValue,
  ValidationResult,
} from "~/modules/json.ide/types";
import { validateSchema } from "~/modules/json.ide/utils/schema";
import { AlertCircle, Check } from "lucide-react";

export interface SchemaValidatorProps {
  /**
   * The JSON data to validate
   */
  data: JsonValue;

  /**
   * The JSON Schema to validate against
   */
  schema: JsonSchema | JSONSchemaType<any>;

  /**
   * Callback for when validation result changes
   */
  onValidationResult?: (result: ValidationResult) => void;

  /**
   * Whether to show the validation result
   */
  showValidation?: boolean;

  /**
   * Custom CSS class
   */
  className?: string;
}

/**
 * A component that validates JSON data against a schema
 */
export function SchemaValidator({
  data,
  schema,
  onValidationResult,
  showValidation = true,
  className = "",
}: SchemaValidatorProps) {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    valid: true,
  });

  // Validate data against schema
  const validate = useCallback(() => {
    try {
      const result = validateSchema(schema, data);

      const validationResult: ValidationResult = {
        valid: result.valid,
        message: result.errorMessage || undefined,
        errors: result.errors
          ? result.errors.map((err) => ({
              path: err.instancePath || "",
              message: err.message || "Unknown error",
            }))
          : undefined,
      };

      setValidationResult(validationResult);

      if (onValidationResult) {
        onValidationResult(validationResult);
      }

      return validationResult;
    } catch (error) {
      const errorResult: ValidationResult = {
        valid: false,
        message:
          error instanceof Error ? error.message : "Unknown validation error",
      };

      setValidationResult(errorResult);

      if (onValidationResult) {
        onValidationResult(errorResult);
      }

      return errorResult;
    }
  }, [data, schema, onValidationResult]);

  // Validate on mount and when data or schema changes
  useEffect(() => {
    validate();
  }, [validate]);

  // Don't render anything if we're not showing validation
  if (!showValidation) {
    return null;
  }

  return (
    <div className={className}>
      {validationResult.valid ? (
        <Alert className="border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Valid</AlertTitle>
          <AlertDescription className="text-green-700">
            JSON data is valid according to the schema
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>
            {validationResult.message}

            {validationResult.errors && validationResult.errors.length > 0 && (
              <ul className="mt-2 ml-4 list-disc">
                {validationResult.errors.map((error, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <li key={index}>
                    {error.path ? (
                      <span className="font-mono">{error.path}</span>
                    ) : (
                      "Root"
                    )}
                    : {error.message}
                  </li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

/**
 * A hook that validates JSON data against a schema
 */
export function useSchemaValidation(
  data: JsonValue,
  schema?: JsonSchema | JSONSchemaType<any>,
): ValidationResult {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    valid: true,
  });

  // Validate data against schema
  useEffect(() => {
    if (!schema) {
      setValidationResult({ valid: true });
      return;
    }

    try {
      const result = validateSchema(schema, data);

      setValidationResult({
        valid: result.valid,
        message: result.errorMessage || undefined,
        errors: result.errors
          ? result.errors.map((err) => ({
              path: err.instancePath || "",
              message: err.message || "Unknown error",
            }))
          : undefined,
      });
    } catch (error) {
      setValidationResult({
        valid: false,
        message:
          error instanceof Error ? error.message : "Unknown validation error",
      });
    }
  }, [data, schema]);

  return validationResult;
}
