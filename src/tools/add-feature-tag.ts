import { z } from 'zod';
import { addFeatureTag } from '../unleash/add-feature-tag.js';

/**
 * Parameters schema for addFeatureTag tool
 */
const addFeatureTagParamsSchema = {
  featureName: z.string().min(1).describe('Name of the feature to add the tag to'),
  tagType: z.string().min(1).describe('Type of the tag'),
  tagValue: z.string().min(1).describe('Value of the tag')
};

/**
 * Handler for adding a tag to a feature
 */
async function handleAddFeatureTag({ featureName, tagType, tagValue }: { featureName: string, tagType: string, tagValue: string }) {
  try {
    // Add tag to the feature
    const success = await addFeatureTag(featureName, tagType, tagValue);
    
    if (!success) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            error: `Failed to add tag "${tagType}:${tagValue}" to feature "${featureName}"` 
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
          message: `Successfully added tag "${tagType}:${tagValue}" to feature "${featureName}"`,
          featureName,
          tagType,
          tagValue
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
 * Tool definition for addFeatureTag
 */
export const addFeatureTagTool = {
  name: "addFeatureTag",
  description: "Add a tag to a feature flag",
  paramsSchema: addFeatureTagParamsSchema,
  handler: handleAddFeatureTag
}; 