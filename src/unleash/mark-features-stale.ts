import { client } from './unleash-client.js';
import { logger } from '../logger.js';

/**
 * Mark features as stale or not stale
 * 
 * @param projectId - The ID of the project containing the features
 * @param features - Array of feature names to mark
 * @param stale - Boolean indicating whether to mark as stale (true) or not stale (false)
 * @returns The response from the Unleash API
 */
export async function markFeaturesStale(
  projectId: string,
  features: string[],
  stale: boolean
) {
  try {
    const endpoint = `/api/admin/projects/${projectId}/stale`;
    const payload = {
      features,
      stale
    };
    
    const response = await client.post(endpoint, payload);
    const action = stale ? 'stale' : 'not stale';
    
    logger.info(`Successfully marked ${features.length} features as ${action} in project '${projectId}'`);
    return response.data;
  } catch (error) {
    logger.error(`Error marking features as ${stale ? 'stale' : 'not stale'} in project '${projectId}':`, error);
    throw error;
  }
} 