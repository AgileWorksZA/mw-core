import { useLoaderData, useFetcher, useNavigate, useParams, useRouteLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { CardEditor } from "~/components/knowledge-alignment/card-editor";
import { knowledgeDB } from "~/modules/knowledge-alignment/db/schema.server";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export async function loader({ params }: LoaderFunctionArgs) {
  const cardId = params.id;
  
  if (!cardId) {
    throw new Response("Card ID is required", { status: 400 });
  }
  
  const card = knowledgeDB.getCard(cardId);
  
  if (!card) {
    throw new Response("Card not found", { status: 404 });
  }
  
  return Response.json({ card });
}

export default function EditKnowledgeCard() {
  const { card } = useLoaderData<typeof loader>();
  const parentData = useRouteLoaderData("routes/knowledge-alignment") as any;
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const params = useParams();

  const handleSaveCard = (data: any) => {
    fetcher.submit(
      { ...data, id: params.id },
      {
        method: "PUT",
        action: `/api/knowledge-cards/${params.id}`,
        encType: "application/json",
      }
    );
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
        <h2 className="text-2xl font-semibold">Edit Knowledge Card</h2>
      </div>
      
      <CardEditor
        card={card}
        onSave={handleSaveCard}
        onCancel={() => navigate("/knowledge-alignment")}
        availableTags={parentData?.tags?.map((t: any) => t.name) || []}
        mcpTools={parentData?.mcpTools || []}
      />
    </div>
  );
}