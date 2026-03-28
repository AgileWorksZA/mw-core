import { useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Star,
  StarOff,
  Save,
  X,
} from "lucide-react";
import type { PromptTemplate, KnowledgeCard } from "~/modules/knowledge-alignment/types";

interface PromptTemplatesProps {
  templates: PromptTemplate[];
  cards: KnowledgeCard[];
  defaultTemplateId: string | null;
}

export function PromptTemplates({ templates, cards, defaultTemplateId }: PromptTemplatesProps) {
  const fetcher = useFetcher();
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [maxTokens, setMaxTokens] = useState<number | undefined>();

  const cardMap = new Map(cards.map(card => [card.id, card]));

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedCardIds([]);
    setTemplateName("");
    setTemplateDescription("");
    setMaxTokens(undefined);
  };

  const handleEdit = (template: PromptTemplate) => {
    setEditingTemplate(template);
    setSelectedCardIds(template.cardIds);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setMaxTokens(template.maxTokens);
  };

  const handleSave = () => {
    if (editingTemplate) {
      // Update existing template
      fetcher.submit(
        {
          name: templateName,
          description: templateDescription,
          cardIds: selectedCardIds,
          maxTokens,
        },
        {
          method: "PUT",
          action: `/api/knowledge-templates/${editingTemplate.id}`,
          encType: "application/json",
        }
      );
    } else {
      // Create new template
      fetcher.submit(
        {
          name: templateName,
          description: templateDescription,
          cardIds: selectedCardIds,
          maxTokens,
        },
        {
          method: "POST",
          action: "/api/knowledge-templates",
          encType: "application/json",
        }
      );
    }
    
    handleCancel();
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTemplate(null);
    setSelectedCardIds([]);
    setTemplateName("");
    setTemplateDescription("");
    setMaxTokens(undefined);
  };

  const handleDelete = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      fetcher.submit(
        {},
        {
          method: "DELETE",
          action: `/api/knowledge-templates/${templateId}`,
        }
      );
    }
  };

  const handleSetDefault = (templateId: string) => {
    fetcher.submit(
      {},
      {
        method: "POST",
        action: `/api/knowledge-templates/${templateId}/set-default`,
      }
    );
  };

  const toggleCardSelection = (cardId: string) => {
    setSelectedCardIds(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Prompt Templates</h3>
          <p className="text-sm text-muted-foreground">
            Create reusable collections of knowledge cards for specific use cases
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Template List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const isDefault = template.id === defaultTemplateId;
          const cardCount = template.cardIds.length;
          const validCards = template.cardIds.filter(id => cardMap.has(id));
          
          return (
            <Card key={template.id} className={isDefault ? "border-primary" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  {isDefault && (
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      Default
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cards:</span>
                    <span>
                      {validCards.length} / {cardCount}
                      {validCards.length < cardCount && (
                        <span className="text-destructive ml-1">(missing)</span>
                      )}
                    </span>
                  </div>
                  {template.maxTokens && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Tokens:</span>
                      <span>{template.maxTokens}</span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Updated {new Date(template.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-3 border-t">
                <div className="flex gap-1 w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(template)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(template.id)}
                    title={isDefault ? "Default template" : "Set as default"}
                    disabled={isDefault}
                  >
                    {isDefault ? (
                      <Star className="h-4 w-4 fill-current" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                    title="Delete"
                    className="ml-auto"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No templates created yet. Create your first template to get started.
          </p>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || !!editingTemplate} onOpenChange={() => handleCancel()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Prompt Template" : "Create Prompt Template"}
            </DialogTitle>
            <DialogDescription>
              Select knowledge cards to include in this template
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Transaction Queries Template"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Describe when to use this template..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTokens">Max Tokens (Optional)</Label>
              <Input
                id="maxTokens"
                type="number"
                value={maxTokens || ""}
                onChange={(e) => setMaxTokens(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="2000"
              />
            </div>

            <div className="space-y-2">
              <Label>Select Knowledge Cards ({selectedCardIds.length} selected)</Label>
              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                {cards.filter(card => card.active).map((card) => {
                  const isSelected = selectedCardIds.includes(card.id);
                  return (
                    <div
                      key={card.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => toggleCardSelection(card.id)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{card.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {card.summary}
                          </div>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {card.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {card.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!templateName || selectedCardIds.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              {editingTemplate ? "Update Template" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}