/**
 * Environments resources for Unleash MCP Server
 */

import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllEnvironments } from "../unleash/get-all-environments.js";

/**
 * Resource handler for listing all environments
 */
export async function handleEnvironmentsList(uri: URL) {
  try {
    const environments = await getAllEnvironments();
    
    if (!environments) {
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({ error: "Failed to fetch environments" })
        }]
      };
    }
    
    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(environments, null, 2)
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
 * Environment resources for registration
 */
export const environmentResources = [
  {
    name: "environments-list",
    template: "unleash://environments",
    handler: handleEnvironmentsList
  }
]; 