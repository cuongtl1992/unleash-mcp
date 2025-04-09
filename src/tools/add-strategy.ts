/**
 * Add strategy tool for Unleash MCP Server
 */

import { z } from 'zod';
import { addFeatureStrategy } from '../unleash/add-feature-strategy.js';

/**
 * Schema for addStrategy tool parameters
 */
export const AddStrategyParamsSchema = {
  projectId: z.string().min(1),
  featureName: z.string().min(1),
  environment: z.string().min(1),
  strategyName: z.string().min(1),
  parameters: z.record(z.string()).optional(),
  constraints: z.array(z.object({
    contextName: z.string(),
    operator: z.string(),
    values: z.array(z.string())
  })).optional()
};

/**
 * Handler for adding a strategy to a feature flag
 */
export async function handleAddStrategy(params: {
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
}) {
  try {
    // Add the strategy to the feature flag
    const result = await addFeatureStrategy({
      projectId: params.projectId,
      featureName: params.featureName,
      environment: params.environment,
      strategyName: params.strategyName,
      parameters: params.parameters,
      constraints: params.constraints
    });
    
    if (!result) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            error: `Failed to add strategy '${params.strategyName}' to feature flag '${params.featureName}'` 
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
          message: `Successfully added strategy '${params.strategyName}' to feature flag '${params.featureName}' in environment '${params.environment}'`,
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
 * Tool definition for addStrategy
 */
export const addStrategyTool = {
  name: "addStrategy",
  description: "Add a strategy to a feature flag in a specific environment",
  paramsSchema: AddStrategyParamsSchema,
  handler: handleAddStrategy
}; 