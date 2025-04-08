import { getAllFeatureFlags } from '../unleash/get-all-feature-flags.js';

/**
 * Handler for getting a list of all feature flags
 */
async function handleListFlags() {
  try {
    // Get all feature flags
    const flags = await getAllFeatureFlags();
    
    if (!flags) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            error: "Failed to fetch feature flags" 
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
          count: flags.length,
          flags: flags
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
 * Tool definition for listFlags
 */
export const listFlags = {
  name: "listFlags",
  description: "Get a list of all feature flags",
  handler: handleListFlags
}; 