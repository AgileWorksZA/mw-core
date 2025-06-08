import type { ActionFunctionArgs } from "react-router";

/**
 * Server-side route to fetch OpenAPI specs from URLs
 * This avoids CORS issues by fetching from the server
 */
export async function action({ request }: ActionFunctionArgs) {
  let url: string | undefined;
  
  try {
    console.log("[OpenAPI Fetch] Processing request...");
    const body = await request.json();
    url = body.url;
    console.log("[OpenAPI Fetch] Requested URL:", url);
    
    if (!url || typeof url !== 'string') {
      console.log("[OpenAPI Fetch] Invalid URL provided");
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      console.log("[OpenAPI Fetch] URL validation failed:", e);
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    console.log("[OpenAPI Fetch] Fetching from URL:", url);
    
    // Fetch the OpenAPI spec with better error handling
    let response;
    try {
      response = await fetch(url, {
        headers: {
          'Accept': 'application/json, application/yaml, text/yaml, text/plain',
          'User-Agent': 'OpenAPI-Client/1.0'
        },
        // Add timeout and other options
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });
    } catch (fetchError) {
      console.error("[OpenAPI Fetch] Fetch error:", fetchError);
      // Provide more specific error messages
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out after 30 seconds');
        } else if (fetchError.message.includes('ENOTFOUND')) {
          throw new Error(`Could not resolve hostname for URL: ${url}`);
        } else if (fetchError.message.includes('ECONNREFUSED')) {
          throw new Error(`Connection refused to URL: ${url}`);
        } else if (fetchError.message.includes('certificate')) {
          throw new Error(`SSL/TLS certificate issue with URL: ${url}`);
        }
      }
      throw new Error(`Failed to fetch from URL: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
    }
    
    console.log("[OpenAPI Fetch] Response status:", response.status);
    
    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: `Failed to fetch: ${response.status} ${response.statusText}` 
      }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    
    // Try to parse the response
    let data;
    let format: 'json' | 'yaml' = 'json';
    
    // First try JSON
    try {
      data = JSON.parse(text);
      format = 'json';
    } catch {
      // If JSON fails, we'd need a YAML parser
      // For now, return an error for YAML
      if (contentType.includes('yaml') || contentType.includes('yml') || url.endsWith('.yaml') || url.endsWith('.yml')) {
        return new Response(JSON.stringify({ 
          error: "YAML format detected. Please convert to JSON format first." 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ 
        error: "Failed to parse response as JSON" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Validate it's an OpenAPI document
    if (!data.openapi && !data.swagger) {
      console.log("[OpenAPI Fetch] Invalid OpenAPI document - missing openapi/swagger field");
      return new Response(JSON.stringify({ 
        error: "Invalid OpenAPI document. Missing 'openapi' or 'swagger' field." 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    console.log("[OpenAPI Fetch] Successfully fetched and parsed OpenAPI spec");
    console.log("[OpenAPI Fetch] OpenAPI version:", data.openapi || data.swagger);
    console.log("[OpenAPI Fetch] API title:", data.info?.title);
    
    return new Response(JSON.stringify({ 
      data,
      format,
      sourceUrl: url
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("[OpenAPI Fetch] Error:", error);
    console.error("[OpenAPI Fetch] Error stack:", error instanceof Error ? error.stack : "No stack");
    
    // Also log to a debug file
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const debugLog = `
[${new Date().toISOString()}] OpenAPI Fetch Error
URL: ${typeof url !== 'undefined' ? url : 'undefined'}
Error: ${error instanceof Error ? error.message : String(error)}
Stack: ${error instanceof Error ? error.stack : 'No stack'}
---
`;
    
    try {
      const logPath = path.join(process.cwd(), "openapi-fetch-debug.log");
      await fs.appendFile(logPath, debugLog);
      console.log("[OpenAPI Fetch] Debug log written to:", logPath);
    } catch (logError) {
      console.error("[OpenAPI Fetch] Failed to write debug log:", logError);
    }
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      details: error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}