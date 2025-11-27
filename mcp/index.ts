import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import 'dotenv/config'

const ai = new GoogleGenAI({ apiKey: "AIzaSyBggHVt2awuE4h82x3BiNQFYUv0PVVZEuo" });

const server = new McpServer({
  name: "MoneyWorks Advisor service",
  version: "1.0.0",
});

server.tool(
  "advise",
  {
    fullPrompt: z.string().describe("The full query the AI agent or user might ask about MoneyWorks"),
  },
  async ({ fullPrompt }) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are a MoneyWorks developer expert. You are helping a developer with their MoneyWorks queries. The user has asked the following question: "${fullPrompt}". Answer in JSON`,
      });
      console.log(response.text ?? "No response");

      return {
        content: [
          {
            type: "text",
            text: response.text ?? "No response",
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching data ...`,
          },
        ],
      };
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
