/**
 * Get flag details tool for Unleash MCP Server
 */

import { z } from 'zod';
import { getFeatureFlag } from '../unleash/get-feature-flag.js';

/**
 * Schema for getFlag tool parameters
 */
export const GetFlagParamsSchema = {
  flagName: z.string()
};

/**
 * Handler for getting detailed information about a feature flag
 */
export async function handleGetFlag({ flagName }: { flagName: string }) {
  try {
    // Get the feature flag
    const flag = await getFeatureFlag(flagName);
    
    if (!flag) {
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
    
    const summary = `The ${flagName} flag is currently ${flag.enabled ? 'enabled' : 'disabled'}.`;
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          flag,
          summary
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
 * Tool definition for getFlag
 */
export const getFlagTool = {
  name: "getFlag",
  description: "Get detailed information about a feature flag",
  paramsSchema: GetFlagParamsSchema,
  handler: handleGetFlag
}; 