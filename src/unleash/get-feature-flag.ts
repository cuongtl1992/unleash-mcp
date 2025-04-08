import { logger } from '../logger.js';
import { client } from './unleash-client.js';

/**
 * Get a specific feature flag from the Unleash repository
 * @param flagName Name of the feature flag
 * @returns Feature flag data or null if not found/available
 */
export async function getFeatureFlag(flagName: string): Promise<any | null> {
  try {
    const response = await client.get(`/api/client/features/${flagName}`);
    logger.log(response);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching feature flag ${flagName}:`, error);
    return null;
  }
}

