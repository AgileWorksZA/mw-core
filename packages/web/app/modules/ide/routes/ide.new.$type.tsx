import type { LoaderFunctionArgs } from "react-router";
// Import removed - using dynamic import for faker instead
import type { FileManifest } from "~/modules/ide/types";
import { faker } from "@faker-js/faker";
import { getTypeAdapter } from "~/modules/ide/utils/get-type-adapter";

async function loader(args: LoaderFunctionArgs) {
  const adapter = getTypeAdapter(args);
  const context = await adapter.emptyContext();

  // Ensure all new files have a defined path
  // If the path doesn't exist in the context, add an ID-based path

  // Generate an ID without any type prefix
  // Use faker directly to avoid prefixes

  const id = [
    faker.color.human(),
    faker.word.adjective(),
    faker.word.noun(),
    faker.number.int({ min: 1000, max: 9999 }),
  ]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

  // New files are created at /ide/create-type (app/routes/ide.create-$type.tsx)
  // The context isn't persisted until posted
  return {
    context,
    manifest: {
      id,
      type: adapter.type,
      path: id,
      mapping: {
        input: {
          variables: {},
        },
        output: {
          variables: {},
        },
      },
    } as FileManifest,
  };
}

export { loader };
