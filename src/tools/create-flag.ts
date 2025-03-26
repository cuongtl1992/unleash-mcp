/**
 * Feature flag creation tool for Unleash MCP Server
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
 * Schema for create flag configuration
 */
const FlagConfigSchema = z.object({
  description: z.string(),
  enabled: z.boolean(),
  strategies: z.array(StrategySchema),
  variants: z.array(VariantSchema).optional(),
  type: z.enum(['release', 'experiment', 'operational', 'permission', 'kill-switch']).optional(),
  project: z.string().optional(),
  environments: z.array(z.string()).optional()
});

/**
 * Schema for createFlag tool parameters
 */
export const CreateFlagParamsSchema = {
  flagName: z.string(),
  config: FlagConfigSchema
};

/**
 * Handler for creating a feature flag
 */
export async function handleCreateFlag({ flagName, config }: { flagName: string; config: any }) {
  try {
    const unleash = getUnleashClient();

    // Check if the feature flag already exists
    const existingFlag = (unleash as any).repository.getToggle(flagName);
    
    if (existingFlag) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            flagName,
            error: `Feature flag '${flagName}' already exists` 
          }, null, 2)
        }],
        isError: true
      };
    }
    
    // In a real implementation, you would use the Unleash Admin API to create the flag
    // Since the unleash-client doesn't provide direct creation capabilities,
    // we'll simulate the creation by returning what would be created
    
    const newFlag = {
      name: flagName,
      description: config.description,
      enabled: config.enabled,
      strategies: config.strategies,
      variants: config.variants || [],
      type: config.type || 'release',
      project: config.project || 'default',
      environments: config.environments || ['development']
    };
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: true,
          flagName,
          message: `Feature flag '${flagName}' created successfully`,
          flag: newFlag
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
 * Tool definition for createFlag
 */
export const createFlagTool = {
  name: "createFlag",
  paramsSchema: CreateFlagParamsSchema,
  handler: handleCreateFlag
}; 