# Variable Mapping Component

This directory contains components for mapping variables in the IDE module.

## Components

- `variable-input.tsx` - A component for editing variable paths, types, and values
- `variable-list.tsx` - A component for managing multiple variable inputs
- `mapping-editor.tsx` - Main component that manages input and output variables

## Usage

The Variable Mapping components can be used to define:

1. **Input Variables** - Variables that a file requires from external sources
2. **Output Variables** - Variables that a file exposes to other files

These components support various data types:
- JSON primitives (string, number, boolean, null, object, array)
- Special internal types:
  - **Pointer** - Reference to another file's output variables
  - **Parameter** - Used for node-based editing (future feature)
  - **FromData** - Path to data within the current file's context

## Example

```tsx
import { MappingEditor } from "~/modules/ide/components/variable-mapping/mapping-editor";

function YourComponent() {
  return (
    <MappingEditor
      inputVariables={inputVariables}
      outputVariables={outputVariables}
      onInputVariablesChange={handleInputVariablesChange}
      onOutputVariablesChange={handleOutputVariablesChange}
    />
  );
}
```