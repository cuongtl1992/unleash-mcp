/**
 * Batch feature flag check tool for Unleash MCP Server
 */

import { z } from 'zod';
import { getUnleashClient } from '../utils/unleash-client.js';

/**
 * Define the unleash context schema based on its documentation
 */
const UnleashContextSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  remoteAddress: z.string().optional(),
  properties: z.record(z.string()).optional(),
  environment: z.string().optional(),
  appName: z.string().optional()
}).passthrough();

/**
 * Schema for batchIsEnabled tool parameters
 */
export const BatchIsEnabledParamsSchema = {
  flagNames: z.array(z.string()),
  context: UnleashContextSchema.optional()
};

/**
 * Handler for checking multiple feature flags at once
 */
export async function handleBatchIsEnabled({ flagNames, context = {} }: { flagNames: string[]; context?: any }) {
  try {
    const unleash = getUnleashClient();
    
    const results = flagNames.map(flagName => ({
      flagName,
      isEnabled: unleash.isEnabled(flagName, context)
    }));
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          results,
          context,
          timestamp: new Date().toISOString()
        }, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          error: error.message 
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Tool definition for batchIsEnabled
 */
export const batchIsEnabledTool = {
  name: "batchIsEnabled",
  paramsSchema: BatchIsEnabledParamsSchema,
  handler: handleBatchIsEnabled
};
