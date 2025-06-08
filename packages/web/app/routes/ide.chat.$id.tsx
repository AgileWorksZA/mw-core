import { useParams } from "react-router";
import { useIdeSelector } from "~/modules/ide/hooks";
import { Editor } from "~/modules/chat.ide/components/editor";

export default function ChatIdePage() {
  const { id } = useParams();
  const project = useIdeSelector((state) => state.context);
  const fileManifest = id ? project.files?.[id] : undefined;
  
  if (!fileManifest || fileManifest.type !== "chat") {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Chat session not found</p>
      </div>
    );
  }

  return <Editor />;
}