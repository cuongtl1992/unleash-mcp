import { client } from './unleash-client.js';
import { logger } from '../logger.js';

/**
 * Get all feature types from the Unleash API
 * @returns Array of feature types with descriptions and lifetimes, or null if not available
 */
export async function getAllFeatureTypes(): Promise<any[] | null> {
  try {
    const response = await client.get('/api/admin/feature-types');
    return response.data || [];
  } catch (error) {
    logger.error('Error fetching feature types:', error);
    return null;
  }
} 