/**
 * Project features resources for Unleash MCP Server
 */

import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getProjectFeatures } from "../unleash/get-project-features.js";

/**
 * Resource handler for listing all features in a project
 */
export async function handleProjectFeaturesList(uri: URL, { projectId }: { projectId: string }) {
  try {
    const features = await getProjectFeatures(projectId);
    
    if (!features) {
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({ error: `Failed to fetch features for project '${projectId}'` })
        }]
      };
    }
    
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
 * Project features resources for registration
 */
export const projectFeaturesResources = [
  {
    name: "project-features-list",
    template: new ResourceTemplate("unleash://projects/{projectId}/features", { list: undefined }),
    handler: handleProjectFeaturesList
  }
]; 