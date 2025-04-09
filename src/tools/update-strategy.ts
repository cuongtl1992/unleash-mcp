/**
 * Update strategy tool for Unleash MCP Server
 */

import { z } from 'zod';
import { updateFeatureStrategy } from '../unleash/update-feature-strategy.js';

/**
 * Schema for updateStrategy tool parameters
 */
export const UpdateStrategyParamsSchema = {
  projectId: z.string().min(1).describe('ID of the project'),
  featureName: z.string().min(1).max(100).regex(/^[a-z0-9-_.]+$/, {
    message: "Name must be URL-friendly: use only lowercase, numbers, hyphens, underscores, and periods"
  }).describe('Name of the feature flag'),
  environment: z.string().min(1).describe('Environment name (e.g., development, production)'),
  strategyId: z.string().min(1).describe('ID of the strategy to update'),
  name: z.string().min(1).describe('Strategy name (e.g., default, userWithId, gradualRollout)'),
  parameters: z.record(z.string(), z.string()).optional().describe('Parameters for the strategy as key-value pairs'),
  constraints: z.array(
    z.object({
      contextName: z.string().describe('Context field name'),
      operator: z.string().describe('Operator (e.g., IN, NOT_IN, STR_CONTAINS)'),
      values: z.array(z.string()).describe('Array of values to compare against')
    })
  ).optional().describe('Constraints for the strategy')
};

/**
 * Handler for updating a feature strategy
 */
export async function handleUpdateStrategy(params: {
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
}) {
  try {
    // Update the feature strategy
    const result = await updateFeatureStrategy({
      projectId: params.projectId,
      featureName: params.featureName,
      environment: params.environment,
      strategyId: params.strategyId,
      name: params.name,
      parameters: params.parameters,
      constraints: params.constraints
    });
    
    if (!result.success) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            statusCode: result.error?.code,
            error: result.error?.message || `Failed to update strategy for feature flag '${params.featureName}'`
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
          message: `Successfully updated strategy for feature flag '${params.featureName}' in environment '${params.environment}'`,
          strategy: result.data
        }, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: false,
          error: error.message || 'An unknown error occurred during the update operation'
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Tool definition for updateStrategy
 */
export const updateStrategyTool = {
  name: "updateStrategy",
  description: "Update a strategy configuration for a feature flag in the specified environment",
  paramsSchema: UpdateStrategyParamsSchema,
  handler: handleUpdateStrategy
}; 