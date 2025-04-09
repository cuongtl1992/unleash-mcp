import { client } from './unleash-client.js';
import { logger } from '../logger.js';

/**
 * Get all tags for a specific feature from the Unleash API
 * @param featureName Name of the feature to get tags for
 * @returns Array of tags or null if not available/error
 */
export async function getFeatureTags(featureName: string): Promise<any[] | null> {
  try {
    const response = await client.get(`/api/admin/features/${featureName}/tags`);
    return response.data || [];
  } catch (error) {
    logger.error(`Error fetching tags for feature ${featureName}:`, error);
    return null;
  }
} 