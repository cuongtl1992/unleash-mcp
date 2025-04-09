/**
 * Update flag tool for Unleash MCP Server
 */

import { z } from 'zod';
import { updateFeatureFlag } from '../unleash/update-feature-flag.js';

/**
 * Schema for updateFlag tool parameters
 */
export const UpdateFlagParamsSchema = {
  projectId: z.string().min(1),
  featureName: z.string().min(1).max(100).regex(/^[a-z0-9-_.]+$/, {
    message: "Name must be URL-friendly: use only lowercase, numbers, hyphens, underscores, and periods"
  }),
  description: z.string().optional(),
  type: z.enum(['release', 'experiment', 'operational', 'permission', 'kill-switch']).optional(),
  impressionData: z.boolean().optional(),
  archived: z.boolean().optional(),
  stale: z.boolean().optional()
};

/**
 * Handler for updating a feature flag
 */
export async function handleUpdateFlag(params: {
  projectId: string;
  featureName: string;
  description?: string;
  type?: string;
  impressionData?: boolean;
  archived?: boolean;
  stale?: boolean;
}) {
  try {
    // Update the feature flag
    const result = await updateFeatureFlag({
      projectId: params.projectId,
      featureName: params.featureName,
      description: params.description,
      type: params.type,
      impressionData: params.impressionData,
      archived: params.archived,
      stale: params.stale
    });
    
    if (!result) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            error: `Failed to update feature flag '${params.featureName}'` 
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
          message: `Successfully updated feature flag '${params.featureName}' in project '${params.projectId}'`,
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
 * Tool definition for updateFlag
 */
export const updateFlagTool = {
  name: "updateFlag",
  description: "Update an existing feature flag in an Unleash project",
  paramsSchema: UpdateFlagParamsSchema,
  handler: handleUpdateFlag
}; 