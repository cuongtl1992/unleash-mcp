import { client } from './unleash-client.js';
import { logger } from '../logger.js';
/**
 * Get all feature flags from the Unleash repository
 * @returns Array of feature flags or null if not available
 */
export async function getAllFeatureFlags(): Promise<any[] | null> {
  try {
    const response = await client.get('/api/client/features');
    return response.data.features || response.data;
  } catch (error) {
    logger.error('Error fetching feature flags:', error);
    return null;
  }
}
