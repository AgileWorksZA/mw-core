/**
 * File Editor Route
 *
 * This is the actual route that renders the editor for a specific file.
 * It works together with its parent route (ide.$type.$id) which:
 * - Loads the file data
 * - Provides the adapter's context
 *
 * This route:
 * 1. Uses the type param to get the appropriate adapter
 * 2. Renders the adapter's Editor component if available
 * 3. Falls back to a generic FileDetails component if no Editor exists
 *
 * The action is imported from api.ide.$type.$id which handles:
 * - DELETE: File deletion, which also updates the project context
 *
 * Note that since this is an index route, it doesn't have its own loader,
 * as it inherits the loader data from its parent route.
 */
import { useParams } from "react-router";
import { useAdapter } from "~/modules/ide/adapter/register";
import { action } from "~/modules/ide/routes/api.ide.$type.$id";
import { FileDetails } from "~/modules/ide/components/file-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MappingEditor } from "~/modules/ide/components/variable-mapping";

export default function File() {
  const { id } = useParams();
  if (!id) {
    return <div>ID is required</div>;
  }
  const { Editor } = useAdapter();
  const editor = !Editor ? <FileDetails /> : <Editor />;

  return (
    <Tabs defaultValue="editor" className="w-full h-full">
      <TabsList>
        <TabsTrigger value="editor" className="font-bold">
          Editor
        </TabsTrigger>
        <TabsTrigger value="mapping" className="font-bold">
          Mapping
        </TabsTrigger>
      </TabsList>
      <TabsContent value="editor">{editor}</TabsContent>
      <TabsContent value="mapping">
        <MappingEditor
          onUpdate={() => console.log("Mapping updated")}
          key={id}
        />
      </TabsContent>
    </Tabs>
  );
}

export { action };
