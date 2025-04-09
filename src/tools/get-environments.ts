import { getAllEnvironments } from '../unleash/get-all-environments.js';

/**
 * Handler for getting a list of all environments
 */
async function handleGetEnvironments() {
  try {
    // Get all environments
    const environments = await getAllEnvironments();
    
    if (!environments) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            error: "Failed to fetch environments" 
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
          count: environments.length,
          environments: environments
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
 * Tool definition for getEnvironments
 */
export const getEnvironments = {
  name: "getEnvironments",
  description: "Get a list of all environments configured in Unleash",
  handler: handleGetEnvironments
}; 