import type { StorageAdapter } from "app/modules/store-kit";
// Import removed - using dynamic import for faker instead
import type { FileContext, FileManifest, Project } from "~/modules/ide/types";
import { type ActionFunctionArgs, data } from "react-router";
import { faker } from "@faker-js/faker";
import { getTypeAdapter } from "~/modules/ide/utils/get-type-adapter";
import { config } from "~/modules/ide/adapter/config";
import { json_file_adapter } from "~/modules/storage/json-adapter/storage.server";

const projectAdapter = json_file_adapter as StorageAdapter<Project>;
const fileAdapter = json_file_adapter as StorageAdapter<FileContext>;

async function action(args: ActionFunctionArgs) {
  const { context, manifest } = (await args.request.json()) as {
    context: FileContext;
    manifest: FileManifest;
  };
  if (!context || !manifest) {
    throw new Response(
      JSON.stringify({
        error: true,
        message: "Context or Manifest is missing",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  const adapter = getTypeAdapter(args);
  const id = [
    faker.color.human(),
    faker.word.adjective(),
    faker.word.noun(),
    faker.number.int({ min: 1000, max: 9999 }),
  ]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
  // Create the file
  manifest.id = id;
  await fileAdapter.write({
    id,
    type: adapter.type,
    payload: { context },
  });

  // We read the file to create the initial context,
  // if it had already existed, we won't override it.
  // This is rare and can only happen if the id was the
  // same for some fluke.
  const project = (
    await projectAdapter.read({
      id: config.type,
      type: config.type,
    })
  ).data;
  // Ensure we don't add any type prefix to the ID
  project.files[manifest.id] = manifest;
  project.fileOrder.push(manifest.id);

  // Update the project with the new file
  await projectAdapter.write({
    id: config.type,
    type: config.type,
    payload: { context: project },
  });
  return data(manifest);
}

export { action };
