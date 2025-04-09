import { z } from 'zod';
import { logger } from '../logger.js';
import { disableFeatureFlag } from '../unleash/disable-feature-flag.js';

/**
 * Schema for the disable-flag tool parameters
 */
export const DisableFlagParamsSchema = {
  /**
   * The ID of the project containing the feature flag
   */
  projectId: z.string().min(1),
  
  /**
   * The name of the feature flag to disable
   */
  featureName: z.string().min(1),
  
  /**
   * The environment in which to disable the feature flag
   */
  environment: z.string().min(1)
};

/**
 * Handler for disabling a feature flag in a specified environment
 */
export async function handleDisableFlag({
  projectId,
  featureName,
  environment
}: {
  projectId: string;
  featureName: string;
  environment: string;
}) {
  logger.info(`Disabling feature flag '${featureName}' in environment '${environment}'`, {
    projectId,
    featureName,
    environment
  });
  
  try {
    const result = await disableFeatureFlag(projectId, featureName, environment);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          message: `Successfully disabled feature flag '${featureName}' in environment '${environment}'`,
          data: result
        }, null, 2)
      }]
    };
  } catch (error: any) {
    // Handle errors from the Unleash API
    const errorMessage = error.response?.data?.message || error.message;
    const status = error.response?.status;
    
    logger.error(`Failed to disable feature flag: ${errorMessage}`, {
      status,
      projectId,
      featureName,
      environment
    });
    
    // Return a structured error response
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: false,
          message: `Failed to disable feature flag: ${errorMessage}`,
          status: status || 500
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Tool definition for disableFlag
 */
export const disableFlagTool = {
  name: "disableFlag",
  description: "Disables a feature flag in the specified environment",
  paramsSchema: DisableFlagParamsSchema,
  handler: handleDisableFlag
}; 