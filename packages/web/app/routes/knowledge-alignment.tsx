import { useState, useEffect } from "react";
import { useLoaderData, useFetcher } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Plus, Brain, FileText, Settings } from "lucide-react";
import { CardEditor } from "~/components/knowledge-alignment/card-editor";
import { CardBrowser } from "~/components/knowledge-alignment/card-browser";
import { knowledgeDB } from "~/modules/knowledge-alignment/db/schema.server";
import type { KnowledgeCard } from "~/modules/knowledge-alignment/types";
import { getMCPClient } from "~/lib/mcp-client";

export async function loader({ request }: LoaderFunctionArgs) {
  const cards = knowledgeDB.searchCards();
  const tags = knowledgeDB.getAllTags();
  const config = knowledgeDB.getConfig();
  
  // Get MCP tools if available
  let mcpTools: string[] = [];
  try {
    const mcpClient = getMCPClient();
    await mcpClient.connect();
    const tools = await mcpClient.listTools();
    mcpTools = tools.map(t => t.name);
  } catch (error) {
    console.error("Failed to get MCP tools:", error);
  }
  
  return Response.json({ cards, tags, config, mcpTools });
}

export default function KnowledgeAlignmentPage() {
  const { cards, tags, config, mcpTools } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<KnowledgeCard | null>(null);
  const [localCards, setLocalCards] = useState(cards);

  useEffect(() => {
    if (fetcher.data?.card) {
      // Update local state after successful save
      setLocalCards((prev) => {
        const exists = prev.find((c) => c.id === fetcher.data.card.id);
        if (exists) {
          return prev.map((c) => (c.id === fetcher.data.card.id ? fetcher.data.card : c));
        } else {
          return [...prev, fetcher.data.card];
        }
      });
      setIsEditorOpen(false);
      setEditingCard(null);
    }
  }, [fetcher.data]);

  const handleSaveCard = (data: Partial<KnowledgeCard>) => {
    if (editingCard) {
      // Update existing card
      fetcher.submit(
        { ...data, id: editingCard.id },
        {
          method: "PUT",
          action: `/api/knowledge-cards/${editingCard.id}`,
          encType: "application/json",
        }
      );
    } else {
      // Create new card
      fetcher.submit(data, {
        method: "POST",
        action: "/api/knowledge-cards",
        encType: "application/json",
      });
    }
  };

  const handleEditCard = (card: KnowledgeCard) => {
    setEditingCard(card);
    setIsEditorOpen(true);
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
      setLocalCards((prev) => prev.filter((c) => c.id !== id));
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
    handleSaveCard(duplicate);
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
    setLocalCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active } : c))
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Brain className="h-10 w-10 text-primary" />
            Knowledge Alignment System
          </h1>
          <p className="text-muted-foreground mt-2">
            Curate domain expertise for MoneyWorks AI agents
          </p>
        </div>
        <Button onClick={() => setIsEditorOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Card
        </Button>
      </div>

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
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Prompt template management coming soon...
            </p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Configuration settings coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Card Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCard ? "Edit Knowledge Card" : "Create Knowledge Card"}
            </DialogTitle>
            <DialogDescription>
              Add domain-specific knowledge to improve AI understanding of MoneyWorks
            </DialogDescription>
          </DialogHeader>
          <CardEditor
            card={editingCard || undefined}
            onSave={handleSaveCard}
            onCancel={() => {
              setIsEditorOpen(false);
              setEditingCard(null);
            }}
            availableTags={tags.map((t) => t.name)}
            mcpTools={mcpTools}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}