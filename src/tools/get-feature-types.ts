import { getAllFeatureTypes } from '../unleash/get-all-feature-types.js';

/**
 * Handler for getting a list of all feature types
 */
async function handleGetFeatureTypes() {
  try {
    // Get all feature types
    const featureTypes = await getAllFeatureTypes();
    
    if (!featureTypes) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            error: "Failed to fetch feature types" 
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
          count: featureTypes.length,
          featureTypes: featureTypes
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
 * Tool definition for getFeatureTypes
 */
export const getFeatureTypes = {
  name: "getFeatureTypes",
  description: "Get a list of all feature types with their descriptions and lifetimes",
  handler: handleGetFeatureTypes
}; 