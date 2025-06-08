/**
 * API Route for File Operations
 *
 * This module provides the action function that handles file-specific operations,
 * particularly file deletion. When a file is deleted, it:
 *
 * 1. Removes the file from storage (using store-kit DELETE action)
 * 2. Updates the project context by removing references to the file
 * 3. Returns the updated project context
 *
 * This route is accessed via DELETE requests to /api/ide/:type/:id
 */
import type { ActionFunctionArgs } from "react-router";
import type { Project } from "~/modules/ide/types";
import { createDELETEAction } from "~/modules/storage/json-adapter/actions";
import { config } from "~/modules/ide/adapter/config";
import { json_file_adapter } from "~/modules/storage/json-adapter/storage.server";

// Define adapters for both files and projects
const fileAdapter = json_file_adapter;

async function action(args: ActionFunctionArgs) {
  if (args.request.method.toLowerCase() === "delete") {
    const action = createDELETEAction<any>(fileAdapter);
    const context = await action(args);
    const project = (
      await json_file_adapter.read({
        id: config.type,
        type: config.type,
      })
    ).data as Project;
    // Then update the project context by removing the file from files and fileOrder

    delete project.files[context.id];
    project.fileOrder = project.fileOrder.filter((id) =>
      Object.keys(project.files).includes(id),
    );
    console.log("Project after delete", project);
    await json_file_adapter.write({
      id: config.type,
      type: config.type,
      payload: { context: project },
    });
    return project;
  }
  throw new Response(
    JSON.stringify({
      error: true,
      message: "Unsupported method",
    }),
    { status: 400, headers: { "Content-Type": "application/json" } },
  );
}

export { action };
