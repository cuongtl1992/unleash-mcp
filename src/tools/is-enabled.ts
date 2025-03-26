/**
 * Feature flag check tool for Unleash MCP Server
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
 * Schema for isEnabled tool parameters
 */
export const IsEnabledParamsSchema = {
  flagName: z.string(),
  context: UnleashContextSchema.optional()
};

/**
 * Handler for checking if a feature flag is enabled
 */
export async function handleIsEnabled({ flagName, context = {} }: { flagName: string; context?: any }) {
  try {
    const unleash = getUnleashClient();
    const isEnabled = unleash.isEnabled(flagName, context);
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          flagName, 
          isEnabled,
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
 * Tool definition for isEnabled
 */
export const isEnabledTool = {
  name: "isEnabled",
  paramsSchema: IsEnabledParamsSchema,
  handler: handleIsEnabled
};
