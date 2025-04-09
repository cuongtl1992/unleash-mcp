/**
 * Update strategy tool for Unleash MCP Server
 */

import { z } from 'zod';
import { updateFeatureStrategy } from '../unleash/update-feature-strategy.js';

/**
 * Schema for updateStrategy tool parameters
 */
export const UpdateStrategyParamsSchema = {
  projectId: z.string().min(1),
  featureName: z.string().min(1).max(100).regex(/^[a-z0-9-_.]+$/, {
    message: "Name must be URL-friendly: use only lowercase, numbers, hyphens, underscores, and periods"
  }),
  environment: z.string().min(1),
  strategyId: z.string().min(1),
  name: z.string().min(1),
  parameters: z.record(z.string(), z.string()).optional(),
  constraints: z.array(
    z.object({
      contextName: z.string(),
      operator: z.string(),
      values: z.array(z.string())
    })
  ).optional()
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
    
    if (!result) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            error: `Failed to update strategy for feature flag '${params.featureName}'` 
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
          strategy: result
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
 * Tool definition for updateStrategy
 */
export const updateStrategyTool = {
  name: "updateStrategy",
  description: "Update a strategy configuration for a feature flag in the specified environment",
  paramsSchema: UpdateStrategyParamsSchema,
  handler: handleUpdateStrategy
}; 