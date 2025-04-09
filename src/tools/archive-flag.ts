/**
 * Archive flag tool for Unleash MCP Server
 */

import { z } from 'zod';
import { archiveFeatureFlag } from '../unleash/archive-feature-flag.js';

/**
 * Schema for archiveFlag tool parameters
 */
export const ArchiveFlagParamsSchema = {
  projectId: z.string().describe('ID of the project'),
  featureName: z.string().describe('Name of the feature flag to archive')
};

/**
 * Handler for archiving a feature flag in a project
 */
export async function handleArchiveFlag({ projectId, featureName }: { projectId: string, featureName: string }) {
  try {
    // Archive the feature flag
    const success = await archiveFeatureFlag(projectId, featureName);
    
    if (!success) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            success: false,
            projectId,
            featureName,
            error: `Feature '${featureName}' not found in project '${projectId}' or could not be archived` 
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
          projectId,
          featureName,
          message: `Feature '${featureName}' in project '${projectId}' has been archived successfully`
        }, null, 2)
      }]
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          success: false,
          projectId,
          featureName,
          error: error.message || 'An unknown error occurred'
        }, null, 2)
      }],
      isError: true
    };
  }
}

/**
 * Tool definition for archiveFlag
 */
export const archiveFlagTool = {
  name: "archiveFlag",
  description: "Archive a feature flag in a specific project",
  paramsSchema: ArchiveFlagParamsSchema,
  handler: handleArchiveFlag
}; 