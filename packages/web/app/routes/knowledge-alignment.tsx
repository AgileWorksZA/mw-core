import { Outlet, useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Plus, Brain, FileText, Settings } from "lucide-react";
import { knowledgeDB } from "~/modules/knowledge-alignment/db/schema.server";
import { getMCPClient } from "~/lib/mcp-client";
import { HelpButton } from "~/components/knowledge-alignment/help-documentation";

export async function loader({ request }: LoaderFunctionArgs) {
  const cards = knowledgeDB.searchCards();
  const tags = knowledgeDB.getAllTags();
  const config = knowledgeDB.getConfig();
  const templates = knowledgeDB.getAllTemplates();
  const defaultTemplate = knowledgeDB.getDefaultTemplate();
  
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
  
  return Response.json({ 
    cards, 
    tags, 
    config, 
    mcpTools,
    templates,
    defaultTemplateId: defaultTemplate?.id || null
  });
}

export default function KnowledgeAlignmentLayout() {
  const navigate = useNavigate();
  
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
        <div className="flex gap-2">
          <HelpButton />
          <Button onClick={() => navigate("/knowledge-alignment/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Card
          </Button>
        </div>
      </div>

      {/* Outlet will render child routes */}
      <Outlet />
    </div>
  );
}