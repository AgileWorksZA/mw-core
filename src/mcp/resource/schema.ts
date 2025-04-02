import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";
import { tableNames } from "../../types/constants";

const tableName = z.enum(tableNames as [string]);

export function registerSchemaTools(server: McpServer) {
  server.tool(
    "getSchema",
    "Displays the schema for a MoneyWorks table as a JSONSchema",
    { tableName: tableName },
    async ({ tableName }) => {
      const root = process.cwd();
      const schema = require(
        `${root}/src/types/json-schema/${tableName.toLowerCase()}-schema.json`,
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(schema),
          },
        ],
      };
    },
  );
}
const root = process.cwd();
export const schema = require(
  `${root}/src/types/json-schema/${"Transaction".toLowerCase()}-schema.json`,
);
console.log(schema);
//"../../types/json-schema/transaction-schema.json"
