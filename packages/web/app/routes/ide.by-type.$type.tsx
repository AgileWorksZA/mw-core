/**
 * File Type Filter Route
 *
 * This route is intended to show all files of a specific type in the project.
 * It filters the project's files based on the type parameter in the URL.
 *
 * Note: This route is currently a placeholder that needs to be fully implemented.
 * The planned functionality includes:
 * - Displaying all files of the specified type in a table
 * - Providing a quick way to create new files of this type
 * - Showing type-specific statistics and information
 *
 * Currently, it just shows basic adapter information for the specified type.
 *
 * This route doesn't have its own loader as it would use the project context
 * already loaded by the parent IDE route.
 */
import { useParams } from "react-router";
import { getAdapter } from "~/modules/ide/adapter/register";

// TODO: Implement the functionality to create a new file based on the adapter type and list the files of this type in a table
export default function ByType() {
  const { type } = useParams();
  if (!type) {
    return <div>Type not found</div>;
  }
  const adapter = getAdapter(type);
  if (!adapter) {
    return <div>Adapter not found</div>;
  }
  return (
    <div>
      <h1>New {adapter.type}</h1>
      <p>{adapter.metadata?.description}</p>
      {/* Add more UI elements as needed */}
      <pre>
        <code>{JSON.stringify(adapter, null, 2)}</code>
      </pre>
    </div>
  );
}
