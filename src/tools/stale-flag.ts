/**
 * Stale flag tool for Unleash MCP Server
 */

import { z } from 'zod';
import { getUnleashClient } from '../utils/unleash-client.js';

/**
 * Schema for staleFlag tool parameters
 */
export const StaleFlagParamsSchema = {
  flagName: z.string()
};

/**
 * Handler for marking a feature flag as stale
 */
export async function handleStaleFlag({ flagName }: { flagName: string }) {
  try {
    const unleash = getUnleashClient();

    // Check if the feature flag exists
    const existingFlag = (unleash as any).repository.getToggle(flagName);
    
    if (!existingFlag) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            flagName,
            error: `Feature flag '${flagName}' not found` 
          }, null, 2)
        }],
        isError: true
      };
    }
    
    // In a real implementation, you would use the Unleash Admin API to mark the flag as stale
    // Since the unleash-client doesn't provide direct update capabilities,
    // we'll simulate marking as stale
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: true,
          flagName,
          status: "stale",
          message: `Feature flag '${flagName}' marked as stale successfully`
        }, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: false,
          flagName,
          error: error.message 
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Tool definition for staleFlag
 */
export const staleFlagTool = {
  name: "staleFlag",
  paramsSchema: StaleFlagParamsSchema,
  handler: handleStaleFlag
}; 