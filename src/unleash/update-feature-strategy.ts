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
 * Interface for feature strategy update result
 */
export interface UpdateFeatureStrategyResult {
  success: boolean;
  data?: any;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Update a strategy configuration for a feature flag in the specified environment
 * @param params Parameters for updating the strategy
 * @returns The result of the update operation with status, data, and error information if applicable
 */
export async function updateFeatureStrategy(params: UpdateFeatureStrategyParams): Promise<UpdateFeatureStrategyResult> {
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
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    const statusCode = error.response?.status;
    let errorMessage = error.message || 'Unknown error occurred';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    logger.error(`Error updating strategy for feature flag ${params.featureName}:`, {
      statusCode,
      message: errorMessage,
      error: error.response?.data || error.message
    });
    
    return {
      success: false,
      error: {
        code: statusCode || 500,
        message: errorMessage
      }
    };
  }
} 