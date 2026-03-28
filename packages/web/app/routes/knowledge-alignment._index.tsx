import { useState, useEffect } from "react";
import { useFetcher, useNavigate, useRouteLoaderData } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FileText, Brain, Settings } from "lucide-react";
import { CardBrowser } from "~/components/knowledge-alignment/card-browser";
import { PromptTemplates } from "~/components/knowledge-alignment/prompt-templates";
import type { KnowledgeCard, PromptTemplate } from "~/modules/knowledge-alignment/types";

export default function KnowledgeAlignmentIndex() {
  const parentData = useRouteLoaderData("routes/knowledge-alignment") as any;
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [localCards, setLocalCards] = useState(parentData?.cards || []);

  useEffect(() => {
    if (fetcher.data?.card) {
      // Update local state after successful save
      setLocalCards((prev: KnowledgeCard[]) => {
        const exists = prev.find((c) => c.id === fetcher.data.card.id);
        if (exists) {
          return prev.map((c) => (c.id === fetcher.data.card.id ? fetcher.data.card : c));
        } else {
          return [...prev, fetcher.data.card];
        }
      });
    }
  }, [fetcher.data]);

  const handleEditCard = (card: KnowledgeCard) => {
    navigate(`/knowledge-alignment/${card.id}`);
  };

  const handleDeleteCard = (id: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      fetcher.submit(
        {},
        {
          method: "DELETE",
          action: `/api/knowledge-cards/${id}`,
        }
      );
      setLocalCards((prev: KnowledgeCard[]) => prev.filter((c) => c.id !== id));
    }
  };

  const handleDuplicateCard = (card: KnowledgeCard) => {
    const duplicate = {
      ...card,
      title: `${card.title} (Copy)`,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      version: undefined,
    };
    fetcher.submit(duplicate, {
      method: "POST",
      action: "/api/knowledge-cards",
      encType: "application/json",
    });
  };

  const handleToggleActive = (id: string, active: boolean) => {
    fetcher.submit(
      { active },
      {
        method: "PUT",
        action: `/api/knowledge-cards/${id}`,
        encType: "application/json",
      }
    );
    setLocalCards((prev: KnowledgeCard[]) =>
      prev.map((c) => (c.id === id ? { ...c, active } : c))
    );
  };

  return (
    <Tabs defaultValue="browse" className="space-y-4">
      <TabsList>
        <TabsTrigger value="browse" className="gap-2">
          <FileText className="h-4 w-4" />
          Browse Cards
        </TabsTrigger>
        <TabsTrigger value="templates" className="gap-2">
          <Brain className="h-4 w-4" />
          Prompt Templates
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="browse">
        <CardBrowser
          cards={localCards}
          onEdit={handleEditCard}
          onDelete={handleDeleteCard}
          onDuplicate={handleDuplicateCard}
          onToggleActive={handleToggleActive}
        />
      </TabsContent>

      <TabsContent value="templates">
        <PromptTemplates 
          templates={parentData?.templates || []}
          cards={parentData?.cards || []}
          defaultTemplateId={parentData?.defaultTemplateId}
        />
      </TabsContent>

      <TabsContent value="settings">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Configuration settings coming soon...
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}