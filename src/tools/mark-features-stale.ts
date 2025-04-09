import { z } from 'zod';
import { logger } from '../logger.js';
import { markFeaturesStale } from '../unleash/mark-features-stale.js';

/**
 * Schema for the mark-features-stale tool parameters
 */
export const MarkFeaturesStaleParamsSchema = {
  /**
   * The ID of the project containing the features
   */
  projectId: z.string().min(1),
  
  /**
   * Array of feature names to mark as stale or not stale
   */
  features: z.array(z.string().min(1)),
  
  /**
   * Whether to mark features as stale (true) or not stale (false)
   */
  stale: z.boolean()
};

/**
 * Handler for marking features as stale or not stale
 */
export async function handleMarkFeaturesStale({
  projectId,
  features,
  stale
}: {
  projectId: string;
  features: string[];
  stale: boolean;
}) {
  const action = stale ? 'stale' : 'not stale';
  logger.info(`Marking ${features.length} features as ${action} in project '${projectId}'`, {
    projectId,
    features,
    stale
  });
  
  try {
    const result = await markFeaturesStale(projectId, features, stale);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          message: `Successfully marked ${features.length} features as ${action} in project '${projectId}'`,
          data: {
            features,
            stale,
            projectId
          }
        }, null, 2)
      }]
    };
  } catch (error: any) {
    // Handle errors from the Unleash API
    const errorMessage = error.response?.data?.message || error.message;
    const status = error.response?.status;
    
    logger.error(`Failed to mark features as ${action}: ${errorMessage}`, {
      status,
      projectId,
      features,
      stale
    });
    
    // Return a structured error response
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          message: `Failed to mark features as ${action}: ${errorMessage}`,
          status: status || 500
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Tool definition for markFeaturesStale
 */
export const markFeaturesStaleTool = {
  name: "markFeaturesStale",
  description: "Marks features as stale or not stale in the specified project",
  paramsSchema: MarkFeaturesStaleParamsSchema,
  handler: handleMarkFeaturesStale
}; 