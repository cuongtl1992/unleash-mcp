/**
 * Validate feature name tool for Unleash MCP Server
 */

import { z } from 'zod';
import { validateFeatureName } from '../unleash/validate-feature-name.js';

/**
 * Schema for validateFeatureName tool parameters
 */
export const ValidateFeatureNameParamsSchema = {
  featureName: z.string().describe('Name of the feature flag to validate')
};

/**
 * Handler for validating a feature flag name
 */
export async function handleValidateFeatureName({ featureName }: { featureName: string }) {
  try {
    // Validate the feature name
    const result = await validateFeatureName(featureName);
    
    if (!result.isValid) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            featureName,
            valid: false,
            error: result.error
          }, null, 2)
        }],
        isError: false // This is not a tool error, just a validation result
      };
    }
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: true,
          featureName,
          valid: true,
          message: `Feature name '${featureName}' is valid and available for use`
        }, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: false,
          featureName,
          error: error.message || 'An unknown error occurred'
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Tool definition for validateFeatureName
 */
export const validateFeatureNameTool = {
  name: "validateFeatureName",
  description: "Validate if a feature flag name is valid and available for use",
  paramsSchema: ValidateFeatureNameParamsSchema,
  handler: handleValidateFeatureName
}; 