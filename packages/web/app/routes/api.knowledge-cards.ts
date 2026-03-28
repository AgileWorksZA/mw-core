import type { ActionFunctionArgs } from "react-router";
import { knowledgeDB } from "~/modules/knowledge-alignment/db/schema.server";
import type { KnowledgeCard, KnowledgeCardFilter } from "~/modules/knowledge-alignment/types";

export async function action({ request }: ActionFunctionArgs) {
  const method = request.method;
  const url = new URL(request.url);
  const body = method !== "GET" ? await request.json() : null;

  try {
    switch (method) {
      case "GET": {
        // Search/filter cards
        const search = url.searchParams.get("search") || undefined;
        const tags = url.searchParams.getAll("tags");
        const categories = url.searchParams.getAll("categories") as any;
        const mcpTools = url.searchParams.getAll("mcpTools");
        const active = url.searchParams.get("active");
        const priority = url.searchParams.getAll("priority") as any;

        const filter: KnowledgeCardFilter = {
          search,
          tags: tags.length > 0 ? tags : undefined,
          categories: categories.length > 0 ? categories : undefined,
          mcpTools: mcpTools.length > 0 ? mcpTools : undefined,
          active: active !== null ? active === "true" : undefined,
          priority: priority.length > 0 ? priority : undefined,
        };

        const cards = knowledgeDB.searchCards(filter);
        return Response.json({ cards });
      }

      case "POST": {
        // Create new card
        if (!body) {
          return Response.json({ error: "Request body required" }, { status: 400 });
        }

        const card = knowledgeDB.createCard(body);
        return Response.json({ card }, { status: 201 });
      }

      case "PUT": {
        // Update existing card
        const id = url.pathname.split("/").pop();
        if (!id || !body) {
          return Response.json({ error: "Card ID and body required" }, { status: 400 });
        }

        const updated = knowledgeDB.updateCard(id, body);
        if (!updated) {
          return Response.json({ error: "Card not found" }, { status: 404 });
        }

        return Response.json({ card: updated });
      }

      case "DELETE": {
        // Delete card
        const id = url.pathname.split("/").pop();
        if (!id) {
          return Response.json({ error: "Card ID required" }, { status: 400 });
        }

        const deleted = knowledgeDB.deleteCard(id);
        if (!deleted) {
          return Response.json({ error: "Card not found" }, { status: 404 });
        }

        return Response.json({ success: true });
      }

      default:
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }
  } catch (error) {
    console.error("Knowledge cards API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

// Specific endpoint for getting a single card
export async function loader({ params }: { params: { id: string } }) {
  try {
    const card = knowledgeDB.getCard(params.id);
    if (!card) {
      return Response.json({ error: "Card not found" }, { status: 404 });
    }
    return Response.json({ card });
  } catch (error) {
    console.error("Error fetching card:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}