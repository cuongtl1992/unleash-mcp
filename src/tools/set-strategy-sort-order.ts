/**
 * Set strategy sort order tool for Unleash MCP Server
 */

import { z } from 'zod';
import { setStrategySortOrder } from '../unleash/set-strategy-sort-order.js';

/**
 * Schema for setStrategySortOrder tool parameters
 */
export const SetStrategySortOrderParamsSchema = {
  projectId: z.string().min(1),
  featureName: z.string().min(1).max(100).regex(/^[a-z0-9-_.]+$/, {
    message: "Name must be URL-friendly: use only lowercase, numbers, hyphens, underscores, and periods"
  }),
  environment: z.string().min(1),
  strategyIds: z.array(z.string()).min(1)
};

/**
 * Handler for setting strategy sort order
 */
export async function handleSetStrategySortOrder(params: {
  projectId: string;
  featureName: string;
  environment: string;
  strategyIds: string[];
}) {
  try {
    // Set the strategy sort order
    const result = await setStrategySortOrder(
      params.projectId,
      params.featureName,
      params.environment,
      params.strategyIds
    );
    
    if (!result) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            error: `Failed to set strategy sort order for feature flag '${params.featureName}'` 
          }, null, 2)
        }],
        isError: true
      };
    }
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: true,
          message: `Successfully set strategy sort order for feature flag '${params.featureName}' in environment '${params.environment}'`
        }, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: false,
          error: error.message 
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Tool definition for setStrategySortOrder
 */
export const setStrategySortOrderTool = {
  name: "setStrategySortOrder",
  description: "Set the sort order of strategies for a feature flag in a specific environment",
  paramsSchema: SetStrategySortOrderParamsSchema,
  handler: handleSetStrategySortOrder
}; 