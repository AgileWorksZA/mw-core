import type { ActionFunctionArgs } from "react-router";
import { knowledgeDB } from "~/modules/knowledge-alignment/db/schema.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const templateId = params.id;
  
  if (!templateId) {
    return Response.json({ error: "Template ID is required" }, { status: 400 });
  }

  const method = request.method;

  switch (method) {
    case "GET": {
      const template = knowledgeDB.getTemplate(templateId);
      if (!template) {
        return Response.json({ error: "Template not found" }, { status: 404 });
      }
      return Response.json({ template });
    }

    case "PUT": {
      const body = await request.json();
      const updated = knowledgeDB.updateTemplate(templateId, body);
      
      if (!updated) {
        return Response.json({ error: "Template not found" }, { status: 404 });
      }

      // Handle default template setting
      if (body.isDefault) {
        knowledgeDB.setDefaultTemplate(templateId);
      }

      return Response.json({ template: updated });
    }

    case "DELETE": {
      const deleted = knowledgeDB.deleteTemplate(templateId);
      if (!deleted) {
        return Response.json({ error: "Template not found" }, { status: 404 });
      }
      return Response.json({ success: true });
    }

    case "POST": {
      // Special action for setting as default
      if (request.url.includes("/set-default")) {
        const success = knowledgeDB.setDefaultTemplate(templateId);
        if (!success) {
          return Response.json({ error: "Template not found" }, { status: 404 });
        }
        return Response.json({ success: true });
      }
      
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    default:
      return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
}