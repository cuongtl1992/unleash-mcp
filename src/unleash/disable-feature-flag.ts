import { client } from './unleash-client.js';
import { logger } from '../logger.js';

/**
 * Disable a feature flag in the specified environment
 * 
 * @param projectId - The ID of the project containing the feature
 * @param featureName - The name of the feature to disable
 * @param environment - The environment in which to disable the feature
 * @returns The response from the Unleash API
 */
export async function disableFeatureFlag(
  projectId: string,
  featureName: string,
  environment: string
) {
  try {
    const endpoint = `/api/admin/projects/${projectId}/features/${featureName}/environments/${environment}/off`;
    const response = await client.post(endpoint);
    logger.info(`Successfully disabled feature flag '${featureName}' in environment '${environment}'`);
    return response.data;
  } catch (error) {
    logger.error(`Error disabling feature flag '${featureName}' in environment '${environment}':`, error);
    throw error;
  }
} 