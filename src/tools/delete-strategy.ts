import { z } from 'zod';
import { deleteFeatureStrategy } from '../unleash/delete-feature-strategy.js';
import { logger } from '../logger.js';

/**
 * Schema for deleteStrategy tool parameters
 */
export const DeleteStrategyParamsSchema = {
  projectId: z.string().min(1),
  featureName: z.string().min(1).max(100).regex(/^[a-z0-9-_.]+$/, {
    message: "Name must be URL-friendly: use only lowercase, numbers, hyphens, underscores, and periods"
  }),
  environment: z.string().min(1),
  strategyId: z.string().min(1)
};

/**
 * Handler for deleting a feature strategy
 */
export async function handleDeleteStrategy(params: {
  projectId: string;
  featureName: string;
  environment: string;
  strategyId: string;
}) {
  try {
    // Delete the feature strategy
    const result = await deleteFeatureStrategy(
      params.projectId,
      params.featureName,
      params.environment,
      params.strategyId
    );
    
    if (!result) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            error: `Failed to delete strategy ${params.strategyId} from feature flag '${params.featureName}'` 
          }, null, 2)
        }],
        isError: true
      };
    }
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: true,
          message: `Successfully deleted strategy ${params.strategyId} from feature flag '${params.featureName}' in environment '${params.environment}'`
        }, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: false,
          error: error.message 
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Tool definition for deleteStrategy
 */
export const deleteStrategyTool = {
  name: "deleteStrategy",
  description: "Delete a strategy configuration from a feature flag in the specified environment",
  paramsSchema: DeleteStrategyParamsSchema,
  handler: handleDeleteStrategy
}; 