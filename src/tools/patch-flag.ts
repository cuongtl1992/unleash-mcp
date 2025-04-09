/**
 * Patch flag tool for Unleash MCP Server
 */

import { z } from 'zod';
import { patchFeatureFlag } from '../unleash/patch-feature-flag.js';

/**
 * Schema for patchFlag tool parameters
 */
export const PatchFlagParamsSchema = {
  projectId: z.string().min(1),
  featureName: z.string().min(1).max(100).regex(/^[a-z0-9-_.]+$/, {
    message: "Name must be URL-friendly: use only lowercase, numbers, hyphens, underscores, and periods"
  }),
  patches: z.array(
    z.object({
      op: z.enum(['add', 'remove', 'replace', 'move', 'copy', 'test']),
      path: z.string(),
      value: z.any().optional(),
      from: z.string().optional()
    })
  )
};

/**
 * Handler for patching a feature flag
 */
export async function handlePatchFlag(params: {
  projectId: string;
  featureName: string;
  patches: Array<{
    op: string;
    path: string;
    value?: any;
    from?: string;
  }>;
}) {
  try {
    // Patch the feature flag
    const result = await patchFeatureFlag({
      projectId: params.projectId,
      featureName: params.featureName,
      patches: params.patches
    });
    
    if (!result) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            error: `Failed to patch feature flag '${params.featureName}'` 
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
          message: `Successfully patched feature flag '${params.featureName}' in project '${params.projectId}'`,
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
 * Tool definition for patchFlag
 */
export const patchFlagTool = {
  name: "patchFlag",
  description: "Modify specific properties of an existing feature flag in an Unleash project using JSON Patch operations",
  paramsSchema: PatchFlagParamsSchema,
  handler: handlePatchFlag
}; 