import { logger } from '../logger.js';
import { client } from './unleash-client.js';

/**
 * Delete a strategy configuration from a feature flag in the specified environment
 * @param projectId The project ID containing the feature flag
 * @param featureName The name of the feature flag
 * @param environment The environment name
 * @param strategyId The strategy ID to delete
 * @returns True if successful, false otherwise
 */
export async function deleteFeatureStrategy(
  projectId: string,
  featureName: string,
  environment: string,
  strategyId: string
): Promise<boolean> {
  try {
    const endpoint = `/api/admin/projects/${projectId}/features/${featureName}/environments/${environment}/strategies/${strategyId}`;
    await client.delete(endpoint);
    logger.info(`Successfully deleted strategy ${strategyId} from feature ${featureName} in environment ${environment}`);
    return true;
  } catch (error) {
    logger.error(`Error deleting strategy ${strategyId} from feature ${featureName}:`, error);
    return false;
  }
} 