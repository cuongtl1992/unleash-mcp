import { z } from 'zod';
import { getFeatureTags } from '../unleash/get-feature-tags.js';

/**
 * Parameters schema for getFeatureTags tool
 */
const getFeatureTagsParamsSchema = {
  featureName: z.string().min(1).describe('Name of the feature to get tags for')
};

/**
 * Handler for getting all tags for a feature
 */
async function handleGetFeatureTags({ featureName }: { featureName: string }) {
  try {
    // Get all tags for the feature
    const tags = await getFeatureTags(featureName);
    
    if (tags === null) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            error: `Failed to fetch tags for feature '${featureName}'` 
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
          featureName,
          count: tags.length,
          tags: tags
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
 * Tool definition for getFeatureTags
 */
export const getFeatureTagsTool = {
  name: "getFeatureTags",
  description: "Get a list of all tags for a specific feature",
  paramsSchema: getFeatureTagsParamsSchema,
  handler: handleGetFeatureTags
}; 