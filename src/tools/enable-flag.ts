import { z } from 'zod';
import { logger } from '../logger.js';
import { enableFeatureFlag } from '../unleash/enable-feature-flag.js';

/**
 * Schema for the enable-flag tool parameters
 */
export const EnableFlagParamsSchema = {
  /**
   * The ID of the project containing the feature flag
   */
  projectId: z.string().min(1),
  
  /**
   * The name of the feature flag to enable
   */
  featureName: z.string().min(1),
  
  /**
   * The environment in which to enable the feature flag
   */
  environment: z.string().min(1)
};

/**
 * Handler for enabling a feature flag in a specified environment
 */
export async function handleEnableFlag({
  projectId,
  featureName,
  environment
}: {
  projectId: string;
  featureName: string;
  environment: string;
}) {
  logger.info(`Enabling feature flag '${featureName}' in environment '${environment}'`, {
    projectId,
    featureName,
    environment
  });
  
  try {
    const result = await enableFeatureFlag(projectId, featureName, environment);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          message: `Successfully enabled feature flag '${featureName}' in environment '${environment}'`,
          data: result
        }, null, 2)
      }]
    };
  } catch (error: any) {
    // Handle errors from the Unleash API
    const errorMessage = error.response?.data?.message || error.message;
    const status = error.response?.status;
    
    logger.error(`Failed to enable feature flag: ${errorMessage}`, {
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
          message: `Failed to enable feature flag: ${errorMessage}`,
          status: status || 500
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Tool definition for enableFlag
 */
export const enableFlagTool = {
  name: "enableFlag",
  description: "Enables a feature flag in the specified environment",
  paramsSchema: EnableFlagParamsSchema,
  handler: handleEnableFlag
}; 