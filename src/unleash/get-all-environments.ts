import { client } from './unleash-client.js';
import { logger } from '../logger.js';

/**
 * Get all environments from the Unleash API
 * @returns Array of environments or null if not available
 */
export async function getAllEnvironments(): Promise<any[] | null> {
  try {
    const response = await client.get('/api/admin/environments');
    return response.data.environments || [];
  } catch (error) {
    logger.error('Error fetching environments:', error);
    return null;
  }
} 