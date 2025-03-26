/**
 * Unleash MCP Server implementation
 */

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { flagResources } from './resources/flags.js';
import { metricsResources } from './resources/metrics.js';
import { strategiesResources } from './resources/strategies.js';
import { isEnabledTool } from './tools/is-enabled.js';
import { batchIsEnabledTool } from './tools/batch-is-enabled.js';
import { updateFlagTool } from './tools/update-flag.js';
import { createFlagTool } from './tools/create-flag.js';
import { staleFlagTool } from './tools/stale-flag.js';
import { getFlagTool } from './tools/get-flag.js';
import { flagCheckPrompt } from './prompts/flag-check.js';
import { batchFlagCheckPrompt } from './prompts/batch-flag-check.js';
import { flagEvaluationPrompt } from './prompts/flag-evaluation.js';

/**
 * Create and configure an Unleash MCP server
 * 
 * @returns The configured MCP server instance
 */
export function createMcpServer(): McpServer {
  console.log('Creating Unleash MCP Server...');
  
  // Create new MCP server
  const server = new McpServer({
    name: "UnleashMCP",
    version: "1.0.0"
  });
  
  // Register flag resources
  flagResources.forEach(resource => {
    server.resource(
      resource.name,
      resource.template as any,
      resource.handler as any
    );
  });
  
  // Register metrics resources
  metricsResources.forEach(resource => {
    server.resource(
      resource.name,
      resource.template as any,
      resource.handler as any
    );
  });
  
  // Register strategies resources
  strategiesResources.forEach(resource => {
    server.resource(
      resource.name,
      resource.template as any,
      resource.handler as any
    );
  });
  
  // Register tools
  server.tool(
    isEnabledTool.name,
    isEnabledTool.paramsSchema as any,
    isEnabledTool.handler as any
  );
  
  server.tool(
    batchIsEnabledTool.name,
    batchIsEnabledTool.paramsSchema as any,
    batchIsEnabledTool.handler as any
  );
  
  server.tool(
    updateFlagTool.name,
    updateFlagTool.paramsSchema as any,
    updateFlagTool.handler as any
  );
  
  server.tool(
    createFlagTool.name,
    createFlagTool.paramsSchema as any,
    createFlagTool.handler as any
  );
  
  server.tool(
    staleFlagTool.name,
    staleFlagTool.paramsSchema as any,
    staleFlagTool.handler as any
  );
  
  server.tool(
    getFlagTool.name,
    getFlagTool.paramsSchema as any,
    getFlagTool.handler as any
  );
  
  // Register prompts
  server.prompt(
    flagCheckPrompt.name,
    flagCheckPrompt.paramsSchema as any,
    flagCheckPrompt.handler as any
  );
  
  server.prompt(
    batchFlagCheckPrompt.name,
    batchFlagCheckPrompt.paramsSchema as any,
    batchFlagCheckPrompt.handler as any
  );
  
  server.prompt(
    flagEvaluationPrompt.name, 
    flagEvaluationPrompt.paramsSchema as any,
    flagEvaluationPrompt.handler as any
  );
  
  return server;
}
