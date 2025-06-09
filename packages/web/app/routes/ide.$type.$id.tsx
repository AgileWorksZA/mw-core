/**
 * Type-Specific File Route
 *
 * This route handles the display of a specific file identified by:
 * - type: The file type (e.g., "json", "openapi", etc.)
 * - id: The unique identifier for the file
 *
 * The loader:
 * 1. Loads the file's contents via the store-kit system
 * 2. Also loads the project context to get the file's metadata
 * 3. Resolves any dependencies (pointers) the file might have
 *
 * This route acts as a container that:
 * 1. Gets the appropriate adapter for the file type
 * 2. Wraps the outlet in the adapter's Provider component
 * 3. The child route (._index) will render the actual editor
 *
 * File deletion is handled through a DELETE request to this route,
 * which removes the file and updates the project context.
 */
import { Outlet, useParams } from "react-router";
import { useAdapter } from "~/modules/ide/adapter/register";
import { loader } from "~/modules/ide/routes/ide.$type.$id";

export default function File() {
	const { id } = useParams();
	if (!id) {
		return <div>ID is required</div>;
	}
	const { Provider, type } = useAdapter();

	return (
		<Provider id={id}>
			<Outlet />
		</Provider>
	);
}

export { loader };
