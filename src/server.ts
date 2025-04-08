/**
 * Unleash MCP Server implementation
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { flagResources } from './resources/flags.js';
import { getFlagTool } from './tools/get-flag.js';
import { listFlags } from './tools/list-flags.js';
import { flagCheckPrompt } from './prompts/flag-check.js';
import { batchFlagCheckPrompt } from './prompts/batch-flag-check.js';
import { flagEvaluationPrompt } from './prompts/flag-evaluation.js';
import { getProjects } from "./tools/get-projects.js";
import { logger } from "./logger.js";

/**
 * Create and configure an Unleash MCP server
 * 
 * @returns The configured MCP server instance
 */
export function createMcpServer(): McpServer {
  logger.log('Creating Unleash MCP Server...');
  
  // Create new MCP server
  const server = new McpServer({
    name: "Unleash MCP",
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
  
  // Register tools
  server.tool(
    getFlagTool.name,
    getFlagTool.description,
    getFlagTool.paramsSchema as any,
    getFlagTool.handler as any
  );

  server.tool(
    getProjects.name,
    getProjects.description,
    getProjects.handler as any
  );
  
  server.tool(
    listFlags.name,
    listFlags.description,
    listFlags.handler as any
  );
  
  // Register prompts
  /*server.prompt(
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
  );*/
  
  return server;
}
