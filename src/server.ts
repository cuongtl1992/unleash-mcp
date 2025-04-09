/**
 * Unleash MCP Server implementation
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { flagResources } from './resources/flags.js';
import { featureTypeResources } from './resources/feature-types.js';
import { projectFeaturesResources } from './resources/project-features.js';
import { getFlagTool } from './tools/get-flag.js';
import { listFlags } from './tools/list-flags.js';
import { getFeatureTypes } from './tools/get-feature-types.js';
import { createFlagTool } from './tools/create-flag.js';
import { updateFlagTool } from './tools/update-flag.js';
import { patchFlagTool } from './tools/patch-flag.js';
import { updateStrategyTool } from './tools/update-strategy.js';
import { addStrategyTool } from './tools/add-strategy.js';
import { enableFlagTool } from './tools/enable-flag.js';
import { disableFlagTool } from './tools/disable-flag.js';
import { markFeaturesStaleTool } from './tools/mark-features-stale.js';
import { deleteStrategyTool } from './tools/delete-strategy.js';
import { setStrategySortOrderTool } from './tools/set-strategy-sort-order.js';
import { getProjectFeaturesTool } from './tools/get-project-features.js';
import { getProjectFeatureTool } from './tools/get-project-feature.js';
import { archiveFlagTool } from './tools/archive-flag.js';
import { validateFeatureNameTool } from './tools/validate-feature-name.js';
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

  // Register feature type resources
  featureTypeResources.forEach(resource => {
    server.resource(
      resource.name,
      resource.template as any,
      resource.handler as any
    );
  });
  
  // Register project features resources
  projectFeaturesResources.forEach(resource => {
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
    createFlagTool.name,
    createFlagTool.description,
    createFlagTool.paramsSchema as any,
    createFlagTool.handler as any
  );
  
  server.tool(
    updateFlagTool.name,
    updateFlagTool.description,
    updateFlagTool.paramsSchema as any,
    updateFlagTool.handler as any
  );
  
  server.tool(
    patchFlagTool.name,
    patchFlagTool.description,
    patchFlagTool.paramsSchema as any,
    patchFlagTool.handler as any
  );

  server.tool(
    addStrategyTool.name,
    addStrategyTool.description,
    addStrategyTool.paramsSchema as any,
    addStrategyTool.handler as any
  );
  
  server.tool(
    updateStrategyTool.name,
    updateStrategyTool.description,
    updateStrategyTool.paramsSchema as any,
    updateStrategyTool.handler as any
  );

  server.tool(
    deleteStrategyTool.name,
    deleteStrategyTool.description,
    deleteStrategyTool.paramsSchema as any,
    deleteStrategyTool.handler as any
  );
  
  server.tool(
    setStrategySortOrderTool.name,
    setStrategySortOrderTool.description,
    setStrategySortOrderTool.paramsSchema as any,
    setStrategySortOrderTool.handler as any
  );
  
  server.tool(
    getProjectFeaturesTool.name,
    getProjectFeaturesTool.description,
    getProjectFeaturesTool.paramsSchema as any,
    getProjectFeaturesTool.handler as any
  );

  server.tool(
    getProjectFeatureTool.name,
    getProjectFeatureTool.description,
    getProjectFeatureTool.paramsSchema as any,
    getProjectFeatureTool.handler as any
  );

  server.tool(
    archiveFlagTool.name,
    archiveFlagTool.description,
    archiveFlagTool.paramsSchema as any,
    archiveFlagTool.handler as any
  );

  server.tool(
    validateFeatureNameTool.name,
    validateFeatureNameTool.description,
    validateFeatureNameTool.paramsSchema as any,
    validateFeatureNameTool.handler as any
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

  server.tool(
    getFeatureTypes.name,
    getFeatureTypes.description,
    getFeatureTypes.handler as any
  );
  
  server.tool(
    enableFlagTool.name,
    enableFlagTool.description,
    enableFlagTool.paramsSchema as any,
    enableFlagTool.handler as any
  );
  
  server.tool(
    disableFlagTool.name,
    disableFlagTool.description,
    disableFlagTool.paramsSchema as any,
    disableFlagTool.handler as any
  );
  
  server.tool(
    markFeaturesStaleTool.name,
    markFeaturesStaleTool.description,
    markFeaturesStaleTool.paramsSchema as any,
    markFeaturesStaleTool.handler as any
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
