/**
 * Get flag details tool for Unleash MCP Server
 */

import { z } from 'zod';
import { getFeatureFlag, getUnleashClient, getUnleashMetrics } from '../utils/unleash-client.js';

/**
 * Schema for getFlag tool parameters
 */
export const GetFlagParamsSchema = {
  flagName: z.string()
};

/**
 * Handler for getting detailed information about a feature flag
 */
export async function handleGetFlag({ flagName }: { flagName: string }) {
  try {
    const unleash = getUnleashClient();

    // Get the feature flag
    const flag = getFeatureFlag(flagName);
    
    if (!flag) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            flagName,
            error: `Feature flag '${flagName}' not found` 
          }, null, 2)
        }],
        isError: true
      };
    }
    
    // Get metrics (in a real implementation, you would get metrics for the specific flag)
    const allMetrics = getUnleashMetrics();
    
    // Create a simulated metrics object for the flag
    const simulatedMetrics = allMetrics ? {
      lastHour: {
        yes: Math.floor(Math.random() * 200),
        no: Math.floor(Math.random() * 800),
        variants: {}
      },
      lastDay: {
        yes: Math.floor(Math.random() * 2800),
        no: Math.floor(Math.random() * 11200),
        variants: {}
      }
    } : null;
    
    // Create simulated events
    const simulatedEvents = [
      {
        type: "created",
        createdBy: "admin",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        type: "updated",
        createdBy: "admin",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        data: {
          enabled: flag.enabled
        }
      }
    ];
    
    // Create a summary
    const strategyDescription = flag.strategies && flag.strategies.length > 0
      ? `It uses ${flag.strategies[0].name} strategy${flag.strategies.length > 1 ? ' (and others)' : ''}.`
      : 'It has no activation strategies.';
    
    const metricsDescription = simulatedMetrics
      ? `The flag has been evaluated ${simulatedMetrics.lastHour.yes + simulatedMetrics.lastHour.no} times in the last hour with ${Math.floor(simulatedMetrics.lastHour.yes / (simulatedMetrics.lastHour.yes + simulatedMetrics.lastHour.no) * 100)}% 'yes' outcomes.`
      : 'No metrics available.';
    
    const summary = `The ${flagName} flag is currently ${flag.enabled ? 'enabled' : 'disabled'}. ${strategyDescription} ${metricsDescription}`;
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          flag,
          metrics: simulatedMetrics,
          events: simulatedEvents,
          summary
        }, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: false,
          flagName,
          error: error.message 
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Tool definition for getFlag
 */
export const getFlagTool = {
  name: "getFlag",
  paramsSchema: GetFlagParamsSchema,
  handler: handleGetFlag
}; 