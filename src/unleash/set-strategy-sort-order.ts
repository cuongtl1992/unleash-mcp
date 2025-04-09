import { logger } from '../logger.js';
import { client } from './unleash-client.js';

/**
 * Set the sort order of strategies for a feature flag in a specific environment
 * @param projectId The project ID containing the feature flag
 * @param featureName The name of the feature flag
 * @param environment The environment name
 * @param strategyIds Array of strategy IDs in the desired order
 * @returns True if successful, false otherwise
 */
export async function setStrategySortOrder(
  projectId: string,
  featureName: string,
  environment: string,
  strategyIds: string[]
): Promise<boolean> {
  try {
    const endpoint = `/api/admin/projects/${projectId}/features/${featureName}/environments/${environment}/strategies/set-sort-order`;
    await client.post(endpoint, strategyIds);
    logger.info(`Successfully set strategy sort order for feature ${featureName} in environment ${environment}`);
    return true;
  } catch (error) {
    logger.error(`Error setting strategy sort order for feature ${featureName}:`, error);
    return false;
  }
} 