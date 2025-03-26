/**
 * Feature flag check prompt for Unleash MCP Server
 */

import { z } from 'zod';

/**
 * Define the unleash context schema based on its documentation
 */
const UnleashContextSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  remoteAddress: z.string().optional(),
  properties: z.record(z.string()).optional(),
  environment: z.string().optional(),
  appName: z.string().optional()
}).passthrough();

/**
 * Parameters schema for the feature flag check prompt
 */
export const FlagCheckParamsSchema = {
  flagName: z.string(),
  context: UnleashContextSchema.optional()
};

/**
 * Handler for the feature flag check prompt
 */
export function handleFlagCheckPrompt({ flagName, context = {} }: { flagName: string; context?: any }) {
  return {
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please check if the feature flag '${flagName}' is enabled with the following context:
${JSON.stringify(context, null, 2)}

Use the 'isEnabled' tool to check the feature flag status. Based on the result, determine if the feature is available and what actions should be taken.

If the feature is enabled, explain what functionality should be provided. If the feature is disabled, explain what alternative behavior should be shown.`
      }
    }]
  };
}

/**
 * Prompt definition for feature flag check
 */
export const flagCheckPrompt = {
  name: "checkFeatureFlag",
  paramsSchema: FlagCheckParamsSchema,
  handler: handleFlagCheckPrompt
};
