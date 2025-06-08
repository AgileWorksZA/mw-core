import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import type { KnowledgeCard, CardCategory, Priority } from "~/modules/knowledge-alignment/types";

interface CardBrowserProps {
  cards: KnowledgeCard[];
  onEdit: (card: KnowledgeCard) => void;
  onDelete: (id: string) => void;
  onDuplicate: (card: KnowledgeCard) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

const categoryIcons = {
  concept: Info,
  calculation: AlertCircle,
  workflow: CheckCircle,
  "data-structure": Info,
  "best-practice": CheckCircle,
  "common-mistake": XCircle,
  integration: Info,
  mwscript: Info,
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

export function CardBrowser({
  cards,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleActive,
}: CardBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [showInactive, setShowInactive] = useState(false);

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      searchTerm === "" ||
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || card.category === selectedCategory;

    const matchesPriority =
      selectedPriority === "all" || card.priority === selectedPriority;

    const matchesActive = showInactive || card.active;

    return matchesSearch && matchesCategory && matchesPriority && matchesActive;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="concept">Concept</SelectItem>
                <SelectItem value="calculation">Calculation</SelectItem>
                <SelectItem value="workflow">Workflow</SelectItem>
                <SelectItem value="data-structure">Data Structure</SelectItem>
                <SelectItem value="best-practice">Best Practice</SelectItem>
                <SelectItem value="common-mistake">Common Mistake</SelectItem>
                <SelectItem value="integration">Integration</SelectItem>
                <SelectItem value="mwscript">MWScript</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show-inactive"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="show-inactive" className="text-sm">
                Show inactive
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCards.length} of {cards.length} cards
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((card) => {
          const Icon = categoryIcons[card.category] || Info;
          
          return (
            <Card
              key={card.id}
              className={`relative ${!card.active ? "opacity-60" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <Badge
                    variant="secondary"
                    className={priorityColors[card.priority]}
                  >
                    {card.priority}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {card.summary}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-1 mb-3">
                  {card.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {card.mcpTools && card.mcpTools.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Tools: {card.mcpTools.join(", ")}
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-3 border-t">
                <div className="flex justify-between items-center w-full">
                  <div className="text-xs text-muted-foreground">
                    v{card.version} • Updated{" "}
                    {new Date(card.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(card)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(card)}
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleActive(card.id, !card.active)}
                      title={card.active ? "Deactivate" : "Activate"}
                    >
                      {card.active ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(card.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No cards found matching your criteria</p>
        </div>
      )}
    </div>
  );
}