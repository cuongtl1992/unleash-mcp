import { client } from './unleash-client.js';
import { logger } from '../logger.js';

/**
 * Enable a feature flag in the specified environment
 * 
 * @param projectId - The ID of the project containing the feature
 * @param featureName - The name of the feature to enable
 * @param environment - The environment in which to enable the feature
 * @returns The response from the Unleash API
 */
export async function enableFeatureFlag(
  projectId: string,
  featureName: string,
  environment: string
) {
  try {
    const endpoint = `/api/admin/projects/${projectId}/features/${featureName}/environments/${environment}/on`;
    const response = await client.post(endpoint);
    logger.info(`Successfully enabled feature flag '${featureName}' in environment '${environment}'`);
    return response.data;
  } catch (error) {
    logger.error(`Error enabling feature flag '${featureName}' in environment '${environment}':`, error);
    throw error;
  }
} 