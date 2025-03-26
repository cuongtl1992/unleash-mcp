/**
 * Metrics resources for Unleash MCP Server
 */

import { 
  getUnleashMetrics,
  isUnleashClientReady 
} from '../utils/unleash-client.js';

/**
 * Resource handler for getting Unleash metrics
 */
export async function handleMetrics(uri: URL) {
  try {
    if (!isUnleashClientReady()) {
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({ error: "Unleash client not ready" })
        }]
      };
    }

    const metrics = getUnleashMetrics();
    
    if (!metrics) {
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({ error: "Metrics not available" })
        }]
      };
    }
    
    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(metrics, null, 2)
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
 * Metrics resources for registration
 */
export const metricsResources = [
  {
    name: "metrics",
    template: "unleash://metrics",
    handler: handleMetrics
  }
];
