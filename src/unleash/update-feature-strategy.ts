import { logger } from '../logger.js';
import { client } from './unleash-client.js';

/**
 * Interface for feature strategy update parameters
 */
export interface UpdateFeatureStrategyParams {
  projectId: string;
  featureName: string;
  environment: string;
  strategyId: string;
  name: string;
  parameters?: Record<string, string>;
  constraints?: Array<{
    contextName: string;
    operator: string;
    values: string[];
  }>;
}

/**
 * Update a strategy configuration for a feature flag in the specified environment
 * @param params Parameters for updating the strategy
 * @returns The updated strategy data or null if update failed
 */
export async function updateFeatureStrategy(params: UpdateFeatureStrategyParams): Promise<any | null> {
  try {
    const payload = {
      name: params.name,
      parameters: params.parameters || {},
      constraints: params.constraints || []
    };

    logger.info(`Updating strategy ${params.strategyId} for feature: ${params.featureName} in environment: ${params.environment}`);
    
    const response = await client.put(
      `/api/admin/projects/${params.projectId}/features/${params.featureName}/environments/${params.environment}/strategies/${params.strategyId}`,
      payload
    );
    
    logger.info(`Successfully updated strategy for feature flag: ${params.featureName}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error updating strategy for feature flag ${params.featureName}:`, error.response?.data || error.message);
    return null;
  }
} 