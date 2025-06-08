/**
 * IDE Main Route Module
 *
 * This module provides the loader and action functions for the main IDE route.
 * It serves as the foundation for the entire IDE by loading and managing the project context.
 */
import {
  createStorageLoader,
  type JsonFileStorageAdapter,
} from "app/modules/store-kit";
import type { Project } from "~/modules/ide/types";
import type { ActionFunctionArgs } from "react-router";
import { createDELETEAction } from "~/modules/storage/json-adapter/actions";
import { createPOSTAction } from "~/modules/storage/json-adapter/actions";
import { config } from "~/modules/ide/adapter/config";
import { json_file_adapter } from "~/modules/storage/json-adapter/storage.server";

/**
 * The default loader and action for the project context.
 * This provides the fundamental data structure that contains all files in the project.
 */

// const action = createGenericDocumentContextAction<any>(json_file_adapter, {
//   type: adapter.type,
//   id: adapter.type,
// });

async function action(args: ActionFunctionArgs) {
  if (args.request.method.toLowerCase() === "delete") {
    const deleteAction = createDELETEAction<any>(json_file_adapter, {
      type: config.type,
      id: config.type,
    });
    return deleteAction(args);
  }
  if (args.request.method.toLowerCase() === "post") {
    const postAction = createPOSTAction<any>(json_file_adapter, {
      type: config.type,
      id: config.type,
    });
    return postAction(args);
  }
  throw new Response(
    JSON.stringify({
      error: true,
      message: "Unsupported method",
    }),
    { status: 400, headers: { "Content-Type": "application/json" } },
  );
}

/**
 * Project context loader
 *
 * This loader uses the store-kit system to load the project configuration
 * from disk. It provides:
 * - files: Record<fileId, fileManifest> - metadata for all files
 * - fileOrder: string[] - order of files in the UI
 * - expandedPaths: string[] - which folders are expanded in the file tree
 * - name: string - project name
 *
 * If no project exists yet, it creates a default empty project structure.
 */
const loader = createStorageLoader<Project>(
  json_file_adapter as unknown as JsonFileStorageAdapter<Project>,
  {
    type: config.type,
    id: config.type,
    defaultContext: {
      name: config.type,
      id: config.type,
      files: {},
      fileOrder: [],
      expandedPaths: [],
    } as Project,
  },
);

export { action, loader };
