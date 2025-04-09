import { logger } from '../logger.js';
import { client } from './unleash-client.js';

/**
 * Interface for feature flag patch parameters
 */
export interface PatchOperation {
  op: string;
  path: string;
  value?: any;
  from?: string;
}

export interface PatchFeatureFlagParams {
  projectId: string;
  featureName: string;
  patches: PatchOperation[];
}

/**
 * Modify specific properties of a feature flag using JSON Patch operations
 * @param params Parameters for patching the feature flag
 * @returns The patched feature flag data or null if operation failed
 */
export async function patchFeatureFlag(params: PatchFeatureFlagParams): Promise<any | null> {
  try {
    logger.info(`Patching feature flag: ${params.featureName} in project: ${params.projectId}`);
    
    const response = await client.patch(
      `/api/admin/projects/${params.projectId}/features/${params.featureName}`,
      params.patches
    );
    
    logger.info(`Successfully patched feature flag: ${params.featureName}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error patching feature flag ${params.featureName}:`, error.response?.data || error.message);
    return null;
  }
} 