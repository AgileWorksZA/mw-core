import type { ActionFunctionArgs } from "react-router";
import { knowledgeDB } from "~/modules/knowledge-alignment/db/schema.server";

export async function action({ request }: ActionFunctionArgs) {
  const method = request.method;

  switch (method) {
    case "GET": {
      const templates = knowledgeDB.getAllTemplates();
      return Response.json({ templates });
    }

    case "POST": {
      const body = await request.json();
      const { name, description, cardIds, isDefault, maxTokens } = body;

      if (!name || !cardIds || !Array.isArray(cardIds)) {
        return Response.json(
          { error: "Name and cardIds are required" },
          { status: 400 }
        );
      }

      try {
        const template = knowledgeDB.createTemplate({
          name,
          description: description || "",
          cardIds,
          isDefault: isDefault || false,
          maxTokens,
        });

        // If this is set as default, update it
        if (isDefault) {
          knowledgeDB.setDefaultTemplate(template.id);
        }

        return Response.json({ template });
      } catch (error) {
        console.error("Error creating template:", error);
        return Response.json(
          { error: "Failed to create template" },
          { status: 500 }
        );
      }
    }

    default:
      return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
}

// GET loader for React Router
export async function loader() {
  const templates = knowledgeDB.getAllTemplates();
  const defaultTemplate = knowledgeDB.getDefaultTemplate();
  
  return Response.json({ 
    templates,
    defaultTemplateId: defaultTemplate?.id || null
  });
}