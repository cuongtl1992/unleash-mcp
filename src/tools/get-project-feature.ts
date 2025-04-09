/**
 * Get project feature tool for Unleash MCP Server
 */

import { z } from 'zod';
import { getProjectFeature } from '../unleash/get-project-feature.js';

/**
 * Schema for getProjectFeature tool parameters
 */
export const GetProjectFeatureParamsSchema = {
  projectId: z.string().describe('ID of the project'),
  featureName: z.string().describe('Name of the feature flag')
};

/**
 * Handler for getting detailed information about a feature flag in a project
 */
export async function handleGetProjectFeature({ projectId, featureName }: { projectId: string, featureName: string }) {
  try {
    // Get the feature flag from the project
    const feature = await getProjectFeature(projectId, featureName);
    
    if (!feature) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            projectId,
            featureName,
            error: `Feature '${featureName}' not found in project '${projectId}'` 
          }, null, 2)
        }],
        isError: true
      };
    }
    
    const statusInfo = feature.enabled !== undefined 
      ? `The ${featureName} flag is currently ${feature.enabled ? 'enabled' : 'disabled'}.` 
      : '';
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: true,
          feature,
          summary: `Feature '${featureName}' in project '${projectId}' retrieved successfully. ${statusInfo}`
        }, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: false,
          projectId,
          featureName,
          error: error.message || 'An unknown error occurred'
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Tool definition for getProjectFeature
 */
export const getProjectFeatureTool = {
  name: "getProjectFeature",
  description: "Get detailed information about a feature flag in a specific project",
  paramsSchema: GetProjectFeatureParamsSchema,
  handler: handleGetProjectFeature
}; 