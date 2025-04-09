import { logger } from '../logger.js';
import { client } from './unleash-client.js';

/**
 * Archive a feature flag in a specific project
 * @param projectId ID of the project
 * @param featureName Name of the feature flag to archive
 * @returns true if the operation was successful, false otherwise
 */
export async function archiveFeatureFlag(projectId: string, featureName: string): Promise<boolean> {
  try {
    await client.delete(`/api/admin/projects/${projectId}/features/${featureName}`);
    logger.info(`Successfully archived feature ${featureName} from project ${projectId}`);
    return true;
  } catch (error: any) {
    logger.error(`Error archiving feature ${featureName} from project ${projectId}:`, error);
    if (error.response && error.response.status === 404) {
      logger.info(`Feature ${featureName} not found in project ${projectId}`);
      return false;
    }
    throw error;
  }
} 