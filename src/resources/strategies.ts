/**
 * Activation strategies resources for Unleash MCP Server
 */

import { isUnleashClientReady } from '../utils/unleash-client.js';

/**
 * Built-in activation strategies for Unleash
 */
const BUILT_IN_STRATEGIES = [
  {
    name: "default",
    description: "Default on/off strategy",
    parameters: []
  },
  {
    name: "userWithId",
    description: "Enable for specific user IDs",
    parameters: [
      {
        name: "userIds",
        description: "Comma-separated list of user IDs",
        type: "string",
        required: true
      }
    ]
  },
  {
    name: "gradualRollout",
    description: "Gradually enable for a percentage of users",
    parameters: [
      {
        name: "percentage",
        description: "Percentage of users (0-100)",
        type: "number",
        required: true
      },
      {
        name: "groupId",
        description: "Group ID for the rollout",
        type: "string",
        required: true
      }
    ]
  },
  {
    name: "remoteAddress",
    description: "Enable for specific IP addresses",
    parameters: [
      {
        name: "IPs",
        description: "Comma-separated list of IP addresses",
        type: "string",
        required: true
      }
    ]
  },
  {
    name: "applicationHostname",
    description: "Enable for specific hostnames",
    parameters: [
      {
        name: "hostNames",
        description: "Comma-separated list of hostnames",
        type: "string",
        required: true
      }
    ]
  },
  {
    name: "flexibleRollout",
    description: "Advanced gradual rollout with multiple parameters",
    parameters: [
      {
        name: "rollout",
        description: "Percentage of users (0-100)",
        type: "number",
        required: true
      },
      {
        name: "stickiness",
        description: "Stickiness calculation (userId, sessionId, random)",
        type: "string",
        required: true
      },
      {
        name: "groupId",
        description: "Group ID for the rollout",
        type: "string",
        required: true
      }
    ]
  }
];

/**
 * Resource handler for listing all activation strategies
 */
export async function handleStrategiesList(uri: URL) {
  try {
    if (!isUnleashClientReady()) {
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({ error: "Unleash client not ready" })
        }]
      };
    }

    // In a real implementation, you might want to fetch custom strategies
    // from the Unleash server. For now, we'll just return the built-in ones.
    const strategies = BUILT_IN_STRATEGIES;
    
    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(strategies, null, 2)
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
 * Strategies resources for registration
 */
export const strategiesResources = [
  {
    name: "strategies-list",
    template: "unleash://strategies",
    handler: handleStrategiesList
  }
]; 