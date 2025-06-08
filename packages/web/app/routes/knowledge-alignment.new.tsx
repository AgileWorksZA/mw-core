import { useFetcher, useNavigate, useRouteLoaderData } from "react-router";
import { CardEditor } from "~/components/knowledge-alignment/card-editor";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function NewKnowledgeCard() {
  const parentData = useRouteLoaderData("routes/knowledge-alignment") as any;
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const handleSaveCard = (data: any) => {
    fetcher.submit(data, {
      method: "POST",
      action: "/api/knowledge-cards",
      encType: "application/json",
    });
  };

  // Navigate back after successful save
  if (fetcher.data?.card) {
    navigate("/knowledge-alignment");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/knowledge-alignment")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cards
        </Button>
        <h2 className="text-2xl font-semibold">Create Knowledge Card</h2>
      </div>
      
      <CardEditor
        onSave={handleSaveCard}
        onCancel={() => navigate("/knowledge-alignment")}
        availableTags={parentData?.tags?.map((t: any) => t.name) || []}
        mcpTools={parentData?.mcpTools || []}
      />
    </div>
  );
}