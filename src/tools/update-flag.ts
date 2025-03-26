/**
 * Feature flag update tool for Unleash MCP Server
 */

import { z } from 'zod';
import { getUnleashClient } from '../utils/unleash-client.js';

/**
 * Schema for strategy parameters
 */
const StrategySchema = z.object({
  name: z.string(),
  parameters: z.record(z.string()).optional()
});

/**
 * Schema for feature flag variant
 */
const VariantSchema = z.object({
  name: z.string(),
  weight: z.number().min(0).max(100),
  payload: z.record(z.any()).optional(),
  stickiness: z.string().optional()
});

/**
 * Schema for update flag configuration
 */
const FlagConfigSchema = z.object({
  description: z.string().optional(),
  enabled: z.boolean().optional(),
  strategies: z.array(StrategySchema).optional(),
  variants: z.array(VariantSchema).optional(),
  type: z.enum(['release', 'experiment', 'operational', 'permission', 'kill-switch']).optional()
});

/**
 * Schema for updateFlag tool parameters
 */
export const UpdateFlagParamsSchema = {
  flagName: z.string(),
  config: FlagConfigSchema
};

/**
 * Handler for updating a feature flag
 */
export async function handleUpdateFlag({ flagName, config }: { flagName: string; config: any }) {
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
    
    // In a real implementation, you would use the Unleash Admin API to update the flag
    // Since the unleash-client doesn't provide direct update capabilities,
    // we'll simulate the update by showing what would be changed
    
    const changes: Record<string, { from: any; to: any }> = {};
    
    if (config.description !== undefined && config.description !== existingFlag.description) {
      changes.description = { from: existingFlag.description, to: config.description };
    }
    
    if (config.enabled !== undefined && config.enabled !== existingFlag.enabled) {
      changes.enabled = { from: existingFlag.enabled, to: config.enabled };
    }
    
    if (config.type !== undefined && config.type !== existingFlag.type) {
      changes.type = { from: existingFlag.type, to: config.type };
    }
    
    // In a real implementation, you would also compare and update strategies and variants
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: true,
          flagName,
          message: `Feature flag '${flagName}' would be updated successfully`,
          changes
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
 * Tool definition for updateFlag
 */
export const updateFlagTool = {
  name: "updateFlag",
  paramsSchema: UpdateFlagParamsSchema,
  handler: handleUpdateFlag
}; 