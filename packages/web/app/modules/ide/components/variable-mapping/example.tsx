import { MappingEditor } from "./mapping-editor";

export function VariableMappingExample() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Variable Mapping Example</h1>
      <p className="mb-6 text-muted-foreground">
        This example demonstrates how to use the Variable Mapping component to
        define input and output variables for a file in the IDE.
      </p>

      <MappingEditor onUpdate={() => console.log("Mapping updated")} />
    </div>
  );
}