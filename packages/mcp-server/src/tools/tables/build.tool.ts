/**
 * Build operations tool for MCP server using @moneyworks/core
 * Handles manufacturing builds and bill of materials
 */

import { z } from "zod";
import { BuildService } from "../../services/tables/build.service";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const buildInputSchema = z.object({
  operation: z.enum(["search", "get", "listFields", "getByProduct", "getRecent", "getWithVariance"]).describe("Operation to perform"),
  
  // Search parameters
  searchTerm: z.string().optional().describe("Search term for description"),
  sequenceNumber: z.number().optional().describe("Build sequence number"),
  productCode: z.string().optional().describe("Product code to filter by"),
  
  // Date parameters
  fromDate: z.string().optional().describe("Start date (YYYYMMDD)"),
  toDate: z.string().optional().describe("End date (YYYYMMDD)"),
  recentDays: z.number().optional().describe("Number of recent days to include"),
  
  // Filter parameters
  location: z.string().optional().describe("Filter by location"),
  minQuantity: z.number().optional().describe("Minimum quantity"),
  maxQuantity: z.number().optional().describe("Maximum quantity"),
  minVariance: z.number().optional().describe("Minimum cost variance"),
  
  // Status filters
  onlyPosted: z.boolean().optional().describe("Only show posted builds"),
  onlyUnposted: z.boolean().optional().describe("Only show unposted builds"),
  
  // Pagination
  limit: z.number().optional().describe("Maximum number of results"),
  offset: z.number().optional().describe("Number of results to skip"),
});

export function registerBuildTool(server: McpServer, buildService: BuildService) {
  server.tool(
    "build_operations",
    "Search, retrieve and analyze manufacturing builds and bill of materials in MoneyWorks",
    buildInputSchema.shape,
    async (params: unknown) => {
      const input = buildInputSchema.parse(params);
      
      try {
        switch (input.operation) {
          case "search": {
            let builds;
            
            // Handle different search scenarios
            if (input.sequenceNumber) {
              const build = await buildService.getBySequence(input.sequenceNumber);
              builds = build ? [build] : [];
            } else if (input.searchTerm) {
              builds = await buildService.searchByDescription(input.searchTerm);
            } else if (input.productCode) {
              builds = await buildService.getByProduct(input.productCode);
            } else if (input.location) {
              builds = await buildService.getByLocation(input.location);
            } else if (input.fromDate && input.toDate) {
              builds = await buildService.getByDateRange(input.fromDate, input.toDate);
            } else if (input.minQuantity !== undefined) {
              builds = await buildService.getByQuantityRange(input.minQuantity, input.maxQuantity);
            } else if (input.onlyPosted) {
              builds = await buildService.getByStatus(true);
            } else if (input.onlyUnposted) {
              builds = await buildService.getByStatus(false);
            } else {
              // Default to recent builds
              builds = await buildService.getRecent(input.recentDays || 30);
            }

            // Apply limit if we got builds through other methods
            if (input.limit && builds.length > input.limit) {
              builds = builds.slice(0, input.limit);
            }

            // Enrich with calculated fields
            const enrichedBuilds = builds.map(build => ({
              ...build,
              statusDisplay: build.status === 1 ? "Posted" : "Unposted",
              costVariance: build.actualCost - build.standardCost,
              variancePercent: build.standardCost > 0 
                ? ((build.actualCost - build.standardCost) / build.standardCost * 100).toFixed(2) + "%"
                : "N/A",
            }));

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  count: enrichedBuilds.length,
                  builds: enrichedBuilds,
                  hasMore: enrichedBuilds.length === (input.limit || 100),
                }, null, 2)
              }]
            };
          }

          case "get": {
            if (!input.sequenceNumber) {
              throw new Error("Sequence number is required for get operation");
            }

            const build = await buildService.getBySequence(input.sequenceNumber);
            
            if (!build) {
              return {
                content: [{
                  type: "text",
                  text: JSON.stringify({
                    success: false,
                    error: `Build with sequence number ${input.sequenceNumber} not found`,
                  }, null, 2)
                }]
              };
            }

            // Enrich with calculated fields
            const enrichedBuild = {
              ...build,
              statusDisplay: build.status === 1 ? "Posted" : "Unposted",
              costVariance: build.actualCost - build.standardCost,
              variancePercent: build.standardCost > 0 
                ? ((build.actualCost - build.standardCost) / build.standardCost * 100).toFixed(2) + "%"
                : "N/A",
            };

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  build: enrichedBuild,
                }, null, 2)
              }]
            };
          }

          case "getByProduct": {
            if (!input.productCode) {
              throw new Error("Product code is required for this operation");
            }

            const builds = await buildService.getByProduct(input.productCode);
            
            const enrichedBuilds = builds.map(build => ({
              ...build,
              statusDisplay: build.status === 1 ? "Posted" : "Unposted",
              costVariance: build.actualCost - build.standardCost,
              variancePercent: build.standardCost > 0 
                ? ((build.actualCost - build.standardCost) / build.standardCost * 100).toFixed(2) + "%"
                : "N/A",
            }));

            // Calculate summary statistics
            const totalQuantity = enrichedBuilds.reduce((sum, b) => sum + b.quantity, 0);
            const totalCost = enrichedBuilds.reduce((sum, b) => sum + b.actualCost, 0);
            const avgCostPerUnit = totalQuantity > 0 ? totalCost / totalQuantity : 0;

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  productCode: input.productCode,
                  count: enrichedBuilds.length,
                  summary: {
                    totalQuantity,
                    totalCost,
                    avgCostPerUnit,
                  },
                  builds: enrichedBuilds,
                }, null, 2)
              }]
            };
          }

          case "getRecent": {
            const days = input.recentDays || 30;
            const builds = await buildService.getRecent(days);
            
            const enrichedBuilds = builds.map(build => ({
              ...build,
              statusDisplay: build.status === 1 ? "Posted" : "Unposted",
              costVariance: build.actualCost - build.standardCost,
              variancePercent: build.standardCost > 0 
                ? ((build.actualCost - build.standardCost) / build.standardCost * 100).toFixed(2) + "%"
                : "N/A",
            }));

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  days,
                  count: enrichedBuilds.length,
                  builds: enrichedBuilds,
                }, null, 2)
              }]
            };
          }

          case "getWithVariance": {
            const minVariance = input.minVariance || 0;
            const builds = await buildService.getWithVariance(minVariance);
            
            const enrichedBuilds = builds.map(build => ({
              ...build,
              statusDisplay: build.status === 1 ? "Posted" : "Unposted",
              costVariance: build.actualCost - build.standardCost,
              variancePercent: build.standardCost > 0 
                ? ((build.actualCost - build.standardCost) / build.standardCost * 100).toFixed(2) + "%"
                : "N/A",
            }));

            // Sort by variance amount
            enrichedBuilds.sort((a, b) => Math.abs(b.costVariance) - Math.abs(a.costVariance));

            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  minVariance,
                  count: enrichedBuilds.length,
                  totalVariance: enrichedBuilds.reduce((sum, b) => sum + b.costVariance, 0),
                  builds: enrichedBuilds,
                }, null, 2)
              }]
            };
          }

          case "listFields": {
            const fields = buildService.getFieldList();
            
            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  success: true,
                  fields,
                  totalFields: fields.length,
                  keyFields: ["SequenceNumber", "ProductCode", "Quantity", "BuildDate", "Status", "ActualCost", "StandardCost"],
                }, null, 2)
              }]
            };
          }

          default:
            throw new Error(`Unknown operation: ${input.operation}`);
        }
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : "Unknown error occurred",
            }, null, 2)
          }]
        };
      }
    }
  );
}