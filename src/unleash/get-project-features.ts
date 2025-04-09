import { logger } from '../logger.js';
import { client } from './unleash-client.js';

/**
 * Get all features for a specific project from the Unleash repository
 * @param projectId The project ID to fetch features for
 * @returns Array of project features or null if not available
 */
export async function getProjectFeatures(projectId: string): Promise<any[] | null> {
  try {
    const response = await client.get(`/api/admin/projects/${projectId}/features`);
    logger.info(`Successfully fetched features for project ${projectId}`);
    return response.data.features || response.data;
  } catch (error) {
    logger.error(`Error fetching features for project ${projectId}:`, error);
    return null;
  }
} 