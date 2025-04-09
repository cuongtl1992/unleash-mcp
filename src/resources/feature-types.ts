/**
 * Feature types resources for Unleash MCP Server
 */

import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllFeatureTypes } from "../unleash/get-all-feature-types.js";

/**
 * Resource handler for listing all feature types
 */
export async function handleFeatureTypesList(uri: URL) {
  try {
    const featureTypes = await getAllFeatureTypes();
    
    if (!featureTypes) {
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({ error: "Failed to fetch feature types" })
        }]
      };
    }
    
    return {
      contents: [{
        uri: uri.href,
        text: JSON.stringify(featureTypes, null, 2)
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
 * Feature types resources for registration
 */
export const featureTypeResources = [
  {
    name: "feature-types-list",
    template: "unleash://feature-types",
    handler: handleFeatureTypesList
  }
]; 