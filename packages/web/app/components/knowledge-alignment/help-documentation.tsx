import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { HelpCircle, Book, Lightbulb, Zap, AlertCircle, CheckCircle } from "lucide-react";

interface HelpDocumentationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDocumentation({ open, onOpenChange }: HelpDocumentationProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl min-w-[80rem] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Knowledge Alignment System Guide
          </DialogTitle>
          <DialogDescription>
            Learn how to improve MoneyWorks AI responses with domain-specific knowledge
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hybrid">Hybrid Approach</TabsTrigger>
            <TabsTrigger value="creating">Creating Cards</TabsTrigger>
            <TabsTrigger value="realtime">Real-time Updates</TabsTrigger>
            <TabsTrigger value="bestpractices">Best Practices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  What is the Knowledge Alignment System?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  The Knowledge Alignment System helps prevent AI hallucination by providing
                  domain-specific knowledge about MoneyWorks accounting software.
                </p>
                <p>
                  Think of it as a curated knowledge base that automatically enhances the AI's
                  understanding of MoneyWorks concepts, terminology, and best practices.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="font-semibold mb-2">How it works:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>You create knowledge cards about specific MoneyWorks topics</li>
                    <li>The AI analyzes each chat message for relevant keywords</li>
                    <li>Matching knowledge cards are automatically included in the AI's context</li>
                    <li>The AI uses this knowledge to provide accurate, domain-specific responses</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Concepts</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div>
                    <dt className="font-semibold">Knowledge Cards</dt>
                    <dd className="text-sm text-muted-foreground">
                      Individual pieces of domain knowledge, like flashcards for the AI
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Tags</dt>
                    <dd className="text-sm text-muted-foreground">
                      Keywords that help match cards to user queries (e.g., "invoices", "unposted")
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Priority Levels</dt>
                    <dd className="text-sm text-muted-foreground">
                      Critical → High → Medium → Low (higher priority cards are selected first)
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Categories</dt>
                    <dd className="text-sm text-muted-foreground">
                      Organize cards by type: Concept, Workflow, Data Structure, MWScript, etc.
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hybrid" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  The Hybrid Approach: Tools + Knowledge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Key Principle</p>
                  <p className="text-sm">
                    Technical specifications live in MCP tool descriptions, while business context 
                    and domain knowledge live in Knowledge Cards. This separation ensures maintainability 
                    and clarity.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">What Goes Where?</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-semibold text-sm mb-2">📧 MCP Tool Descriptions</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Parameter formats (NameType='C')</li>
                        <li>• Field names and types</li>
                        <li>• Valid enum values</li>
                        <li>• API constraints</li>
                        <li>• Direct usage syntax</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h5 className="font-semibold text-sm mb-2">🧠 Knowledge Cards</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Business concepts</li>
                        <li>• Why and when to use</li>
                        <li>• Common workflows</li>
                        <li>• Edge cases</li>
                        <li>• Best practices</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Tool Companion Cards</h4>
                  <p className="text-sm mb-2">
                    Special category of cards that provide business context for specific MCP tools:
                  </p>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Example:</strong> The 'names' tool shows HOW to filter (NameType='C'), 
                      while its companion card explains WHAT customers are in MoneyWorks context 
                      and WHEN to use different filters.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Benefits of Hybrid Approach</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Clean separation of concerns</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Technical changes don't affect business knowledge</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Users can customize knowledge without touching code</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>AI gets both precise syntax AND rich context</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creating" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Creating Effective Knowledge Cards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Essential Fields</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Title:</strong> Clear, descriptive name (e.g., "Transaction Status Codes")
                    </li>
                    <li>
                      <strong>Summary:</strong> One-line description of what the card teaches
                    </li>
                    <li>
                      <strong>Content:</strong> Detailed explanation using Markdown formatting
                    </li>
                    <li>
                      <strong>Tags:</strong> Keywords that trigger this card (e.g., "status", "unposted")
                    </li>
                    <li>
                      <strong>Category:</strong> Choose the right type:
                      <ul className="ml-4 mt-1 space-y-1 text-xs">
                        <li>• <strong>Tool Companion:</strong> Business context for MCP tools</li>
                        <li>• <strong>Concept:</strong> Core MoneyWorks concepts</li>
                        <li>• <strong>Workflow:</strong> Step-by-step procedures</li>
                        <li>• <strong>Business Rule:</strong> Logic and compliance</li>
                        <li>• <strong>Common Mistake:</strong> What to avoid</li>
                        <li>• <strong>Troubleshooting:</strong> Problem-solving guides</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Optional Enhancements</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Examples:</strong> Show correct and incorrect usage patterns
                    </li>
                    <li>
                      <strong>MCP Tools:</strong> Associate with specific MoneyWorks tools
                    </li>
                    <li>
                      <strong>Priority:</strong> Set higher for critical knowledge
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <p className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Example: Transaction Status Card
                  </p>
                  <div className="text-sm space-y-1">
                    <p><strong>Title:</strong> Understanding Transaction Status Codes</p>
                    <p><strong>Tags:</strong> transactions, status, unposted, invoices</p>
                    <p><strong>Content:</strong> Explains OP=Open/Unposted, CL=Closed/Posted, etc.</p>
                    <p><strong>Priority:</strong> Critical (fixes common errors)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Real-time Knowledge Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Changes take effect immediately!</p>
                  <p className="text-sm">
                    Every chat message queries the knowledge database fresh. There's no caching
                    or delay - your changes affect the very next AI response.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">How Selection Works</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>AI analyzes the last 5 messages for context</li>
                    <li>Extracts keywords like "invoice", "unposted", "account"</li>
                    <li>Searches for cards with matching tags</li>
                    <li>Filters to only active cards</li>
                    <li>Sorts by priority (Critical → High → Medium → Low)</li>
                    <li>Includes top 5 most relevant cards in the prompt</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Testing Your Changes</h4>
                  <p className="text-sm mb-2">To verify your knowledge cards are working:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Create or edit a knowledge card</li>
                    <li>Go to MoneyWorks AI Chat</li>
                    <li>Ask a question that should trigger your card</li>
                    <li>The AI should use your knowledge immediately</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bestpractices" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Do's
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Be specific and factual about MoneyWorks behavior</li>
                    <li>• Include actual field names, codes, and values</li>
                    <li>• Provide examples of correct API calls or parameters</li>
                    <li>• Use multiple relevant tags for better matching</li>
                    <li>• Set appropriate priority levels</li>
                    <li>• Keep cards focused on a single concept</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    Don'ts
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Don't create overly broad cards</li>
                    <li>• Avoid generic information the AI already knows</li>
                    <li>• Don't duplicate existing cards</li>
                    <li>• Avoid contradicting other cards</li>
                    <li>• Don't include sensitive data or credentials</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Pro Tips</p>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <strong>Monitor Usage:</strong> Check which cards are used most frequently
                    </li>
                    <li>
                      <strong>Iterate:</strong> Refine cards based on AI responses
                    </li>
                    <li>
                      <strong>Test Thoroughly:</strong> Verify cards work as expected
                    </li>
                    <li>
                      <strong>Stay Organized:</strong> Use consistent naming and tagging
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Use Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Status Codes:</strong> Explain OP=Open, CL=Closed, etc.
                  </li>
                  <li>
                    <strong>Transaction Types:</strong> Define SI=Sales Invoice, PI=Purchase Invoice
                  </li>
                  <li>
                    <strong>API Parameters:</strong> Correct parameter names and formats
                  </li>
                  <li>
                    <strong>MWScript Functions:</strong> Syntax and usage examples
                  </li>
                  <li>
                    <strong>Common Mistakes:</strong> What to avoid when querying data
                  </li>
                  <li>
                    <strong>Workflows:</strong> Step-by-step procedures
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export function HelpButton() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <HelpCircle className="h-4 w-4" />
        Help
      </Button>
      <HelpDocumentation open={open} onOpenChange={setOpen} />
    </>
  );
}