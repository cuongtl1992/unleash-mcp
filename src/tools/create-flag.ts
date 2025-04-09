/**
 * Create flag tool for Unleash MCP Server
 */

import { z } from 'zod';
import { createFeatureFlag } from '../unleash/create-feature-flag.js';

/**
 * Schema for createFlag tool parameters
 */
export const CreateFlagParamsSchema = {
  name: z.string().min(1).max(100).regex(/^[a-z0-9-_.]+$/, {
    message: "Name must be URL-friendly: use only lowercase, numbers, hyphens, underscores, and periods"
  }),
  project: z.string(),
  description: z.string().optional(),
  type: z.enum(['release', 'experiment', 'operational', 'permission', 'kill-switch']).optional(),
  impressionData: z.boolean().optional()
};

/**
 * Handler for creating a new feature flag
 */
export async function handleCreateFlag(params: {
  name: string;
  project: string;
  description?: string;
  type?: string;
  impressionData?: boolean;
}) {
  try {
    // Create the feature flag
    const result = await createFeatureFlag({
      name: params.name,
      project: params.project,
      description: params.description,
      type: params.type,
      impressionData: params.impressionData
    });
    
    if (!result) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            error: `Failed to create feature flag '${params.name}'` 
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
          message: `Successfully created feature flag '${params.name}' in project '${params.project}'`,
          flag: result
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
 * Tool definition for createFlag
 */
export const createFlagTool = {
  name: "createFlag",
  description: "Create a new feature flag in an Unleash project",
  paramsSchema: CreateFlagParamsSchema,
  handler: handleCreateFlag
}; 