import { logger } from '../logger.js';
import { client } from './unleash-client.js';

/**
 * Interface for feature strategy parameters
 */
export interface AddFeatureStrategyParams {
  projectId: string;
  featureName: string;
  environment: string;
  strategyName: string;
  parameters?: Record<string, string>;
  constraints?: Array<{
    contextName: string;
    operator: string;
    values: string[];
  }>;
}

/**
 * Add a strategy to a feature flag in a specific environment
 * @param params Parameters for adding the strategy
 * @returns The created strategy data or null if creation failed
 */
export async function addFeatureStrategy(params: AddFeatureStrategyParams): Promise<any | null> {
  try {
    const payload = {
      name: params.strategyName,
      parameters: params.parameters || {},
      constraints: params.constraints || []
    };

    logger.info(`Adding strategy ${params.strategyName} to feature flag: ${params.featureName} in project: ${params.projectId} (environment: ${params.environment})`);
    
    const response = await client.post(
      `/api/admin/projects/${params.projectId}/features/${params.featureName}/environments/${params.environment}/strategies`,
      payload
    );
    
    logger.info(`Successfully added strategy to feature flag: ${params.featureName}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error adding strategy to feature flag ${params.featureName}:`, error.response?.data || error.message);
    return null;
  }
} 