import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { X, Plus, Eye, Edit as EditIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useResolvedTheme } from "~/modules/theme-preferences/hooks";
import { marked } from "marked";
import type { KnowledgeCard } from "~/modules/knowledge-alignment/types";

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

const cardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string(),
  priority: z.string(),
  active: z.boolean(),
});

interface CardEditorProps {
  card?: KnowledgeCard;
  onSave: (data: Partial<KnowledgeCard>) => void;
  onCancel: () => void;
  availableTags: string[];
  mcpTools: string[];
}

export function CardEditor({ card, onSave, onCancel, mcpTools }: CardEditorProps) {
  const [tags, setTags] = useState<string[]>(card?.tags || []);
  const [selectedTools, setSelectedTools] = useState<string[]>(card?.mcpTools || []);
  const [newTag, setNewTag] = useState("");
  const [correctExamples, setCorrectExamples] = useState<string[]>(
    card?.examples?.correct || []
  );
  const [incorrectExamples, setIncorrectExamples] = useState<string[]>(
    card?.examples?.incorrect || []
  );
  const [isPreview, setIsPreview] = useState(false);
  const theme = useResolvedTheme();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: card?.title || "",
      summary: card?.summary || "",
      content: card?.content || "",
      category: card?.category || "concept",
      priority: card?.priority || "medium",
      active: card?.active ?? true,
    },
  });

  const onSubmit = (data: any) => {
    onSave({
      ...data,
      tags,
      mcpTools: selectedTools.length > 0 ? selectedTools : undefined,
      examples:
        correctExamples.length > 0 || incorrectExamples.length > 0
          ? {
              correct: correctExamples.length > 0 ? correctExamples : undefined,
              incorrect: incorrectExamples.length > 0 ? incorrectExamples : undefined,
            }
          : undefined,
    });
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{card ? "Edit" : "Create"} Knowledge Card</CardTitle>
          <CardDescription>
            Create domain-specific knowledge to improve AI understanding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., Transaction Types in MoneyWorks"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              {...register("summary")}
              placeholder="Brief description of this knowledge"
              rows={2}
            />
            {errors.summary && (
              <p className="text-sm text-destructive">{errors.summary.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Content (Markdown supported)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
                className="gap-2"
              >
                {isPreview ? (
                  <>
                    <EditIcon className="h-4 w-4" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Preview
                  </>
                )}
              </Button>
            </div>
            <div className="border rounded-md overflow-hidden">
              {isPreview ? (
                <div 
                  className="p-4 min-h-[300px] max-h-[300px] overflow-auto markdown-preview"
                  dangerouslySetInnerHTML={{ 
                    __html: marked(watch("content") || "") 
                  }}
                />
              ) : (
                <Editor
                  height="300px"
                  defaultLanguage="markdown"
                  value={watch("content")}
                  onChange={(value) => setValue("content", value || "")}
                  theme={theme === "light" ? "vs" : "vs-dark"}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "off",
                    wordWrap: "on",
                    padding: { top: 8, bottom: 8 },
                    scrollBeyondLastLine: false,
                    renderWhitespace: "none",
                    folding: false,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 0,
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    scrollbar: {
                      vertical: "visible",
                      horizontal: "hidden",
                    },
                    overviewRulerBorder: false,
                  }}
                />
              )}
            </div>
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={watch("category")}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concept">Concept</SelectItem>
                  <SelectItem value="tool-companion">Tool Companion</SelectItem>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="data-structure">Data Structure</SelectItem>
                  <SelectItem value="best-practice">Best Practice</SelectItem>
                  <SelectItem value="common-mistake">Common Mistake</SelectItem>
                  <SelectItem value="business-rule">Business Rule</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                  <SelectItem value="mwscript">MWScript</SelectItem>
                  <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={watch("priority")}
                onValueChange={(value) => setValue("priority", value)}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 flex-wrap mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* MCP Tools */}
          <div className="space-y-2">
            <Label>Associated MCP Tools</Label>
            <div className="flex gap-2 flex-wrap">
              {mcpTools.map((tool) => (
                <Badge
                  key={tool}
                  variant={selectedTools.includes(tool) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTool(tool)}
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>

          {/* Examples */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Correct Examples</Label>
              {correctExamples.map((example, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={example}
                    onChange={(e) => {
                      const updated = [...correctExamples];
                      updated[index] = e.target.value;
                      setCorrectExamples(updated);
                    }}
                    placeholder="Example of correct usage"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setCorrectExamples(correctExamples.filter((_, i) => i !== index))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCorrectExamples([...correctExamples, ""])}
              >
                Add Correct Example
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Incorrect Examples</Label>
              {incorrectExamples.map((example, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={example}
                    onChange={(e) => {
                      const updated = [...incorrectExamples];
                      updated[index] = e.target.value;
                      setIncorrectExamples(updated);
                    }}
                    placeholder="Example of incorrect usage"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setIncorrectExamples(incorrectExamples.filter((_, i) => i !== index))
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIncorrectExamples([...incorrectExamples, ""])}
              >
                Add Incorrect Example
              </Button>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              {...register("active")}
              className="h-4 w-4"
            />
            <Label htmlFor="active">Active (include in prompts)</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Card</Button>
      </div>
    </form>
  );
}