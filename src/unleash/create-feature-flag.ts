import { logger } from '../logger.js';
import { client } from './unleash-client.js';

/**
 * Interface for feature flag creation parameters
 */
export interface CreateFeatureFlagParams {
  name: string;
  description?: string;
  type?: string;
  project: string;
  impressionData?: boolean;
}

/**
 * Create a new feature flag in the Unleash repository
 * @param params Parameters for creating the feature flag
 * @returns The created feature flag data or null if creation failed
 */
export async function createFeatureFlag(params: CreateFeatureFlagParams): Promise<any | null> {
  try {
    const payload = {
      name: params.name,
      description: params.description || '',
      type: params.type || 'release',
      impressionData: params.impressionData !== undefined ? params.impressionData : false
    };

    logger.info(`Creating feature flag: ${params.name} in project: ${params.project}`);
    
    const response = await client.post(
      `/api/admin/projects/${params.project}/features`,
      payload
    );
    
    logger.info(`Successfully created feature flag: ${params.name}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error creating feature flag ${params.name}:`, error.response?.data || error.message);
    return null;
  }
} 