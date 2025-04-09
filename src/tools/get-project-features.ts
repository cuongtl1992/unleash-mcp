/**
 * Get project features tool for Unleash MCP Server
 */

import { z } from 'zod';
import { getProjectFeatures } from '../unleash/get-project-features.js';

/**
 * Schema for getProjectFeatures tool parameters
 */
export const GetProjectFeaturesParamsSchema = {
  projectId: z.string().min(1)
};

/**
 * Handler for fetching project features
 */
export async function handleGetProjectFeatures(params: {
  projectId: string;
}) {
  try {
    // Get the project features
    const features = await getProjectFeatures(params.projectId);
    
    if (!features) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            error: `Failed to fetch features for project '${params.projectId}'` 
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
          message: `Successfully fetched features for project '${params.projectId}'`,
          features: features
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
 * Tool definition for getProjectFeatures
 */
export const getProjectFeaturesTool = {
  name: "getProjectFeatures",
  description: "Get all features for a specific project from the Unleash repository",
  paramsSchema: GetProjectFeaturesParamsSchema,
  handler: handleGetProjectFeatures
}; 