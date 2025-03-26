/**
 * Feature flag resources for Unleash MCP Server
 */

import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { 
  getAllFeatureFlags, 
  getFeatureFlag, 
  isUnleashClientReady 
} from '../utils/unleash-client.js';

/**
 * Resource handler for listing all feature flags
 */
export async function handleFlagsList(uri: URL) {
  try {
    if (!isUnleashClientReady()) {
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({ error: "Unleash client not ready" })
        }]
      };
    }

    const features = getAllFeatureFlags();
    
    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(features, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify({ error: error.message })
      }]
    };
  }
}

/**
 * Resource handler for getting specific feature flag details
 */
export async function handleFlagDetails(uri: URL, { flagName }: { flagName: string }) {
  try {
    if (!isUnleashClientReady()) {
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({ error: "Unleash client not ready" })
        }]
      };
    }

    const feature = getFeatureFlag(flagName);
    
    if (!feature) {
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({ error: `Feature flag '${flagName}' not found` })
        }]
      };
    }
    
    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(feature, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify({ error: error.message })
      }]
    };
  }
}

/**
 * Feature flag resources for registration
 */
export const flagResources = [
  {
    name: "flags-list",
    template: "unleash://flags",
    handler: handleFlagsList
  },
  {
    name: "flag-details",
    template: new ResourceTemplate("unleash://flags/{flagName}", { list: undefined }),
    handler: handleFlagDetails
  }
];
