import type { ActionFunctionArgs } from "react-router";
import { saveResource } from "~/modules/ide/utils/resource-manager";

/**
 * Server-side route to save OpenAPI specs to the public resources folder
 */
export async function action({ request }: ActionFunctionArgs) {
  try {
    const { id, content } = await request.json();
    
    if (!id || typeof id !== 'string') {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    if (!content || typeof content !== 'string') {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Save the OpenAPI spec to the public resources folder
    const resourceInfo = await saveResource('openapi', id, content, '.json');
    
    return new Response(JSON.stringify({ 
      success: true,
      resourcePath: resourceInfo.publicPath,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error saving OpenAPI spec:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}