import { logger } from '../logger.js';
import { client } from './unleash-client.js';

/**
 * Get a specific feature flag from a project in the Unleash repository
 * @param projectId ID of the project
 * @param featureName Name of the feature flag
 * @returns Feature flag data or null if not found/available
 */
export async function getProjectFeature(projectId: string, featureName: string): Promise<any | null> {
  try {
    const response = await client.get(`/api/admin/projects/${projectId}/features/${featureName}`);
    logger.info(`Successfully fetched feature ${featureName} from project ${projectId}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error fetching feature ${featureName} from project ${projectId}:`, error);
    if (error.response && error.response.status === 404) {
      logger.info(`Feature ${featureName} not found in project ${projectId}`);
      return null;
    }
    throw error;
  }
} 