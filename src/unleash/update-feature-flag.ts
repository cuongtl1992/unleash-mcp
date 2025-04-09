import { logger } from '../logger.js';
import { client } from './unleash-client.js';

/**
 * Interface for feature flag update parameters
 */
export interface UpdateFeatureFlagParams {
  projectId: string;
  featureName: string;
  description?: string;
  type?: string;
  impressionData?: boolean;
  archived?: boolean;
  stale?: boolean;
}

/**
 * Update an existing feature flag in the Unleash repository
 * @param params Parameters for updating the feature flag
 * @returns The updated feature flag data or null if update failed
 */
export async function updateFeatureFlag(params: UpdateFeatureFlagParams): Promise<any | null> {
  try {
    const payload: Record<string, any> = {};
    
    // Only include properties that need to be updated
    if (params.description !== undefined) payload.description = params.description;
    if (params.type !== undefined) payload.type = params.type;
    if (params.impressionData !== undefined) payload.impressionData = params.impressionData;
    if (params.archived !== undefined) payload.archived = params.archived;
    if (params.stale !== undefined) payload.stale = params.stale;

    logger.info(`Updating feature flag: ${params.featureName} in project: ${params.projectId}`);
    
    const response = await client.put(
      `/api/admin/projects/${params.projectId}/features/${params.featureName}`,
      payload
    );
    
    logger.info(`Successfully updated feature flag: ${params.featureName}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error updating feature flag ${params.featureName}:`, error.response?.data || error.message);
    return null;
  }
} 