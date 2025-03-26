/**
 * Batch feature flag check prompt for Unleash MCP Server
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
 * Parameters schema for the batch feature flag check prompt
 */
export const BatchFlagCheckParamsSchema = {
  flagNames: z.array(z.string()),
  context: UnleashContextSchema.optional()
};

/**
 * Handler for the batch feature flag check prompt
 */
export function handleBatchFlagCheckPrompt({ flagNames, context = {} }: { flagNames: string[]; context?: any }) {
  return {
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please check if the following feature flags are enabled with this context:
${JSON.stringify(context, null, 2)}

Flags to check:
${flagNames.map(flag => `- ${flag}`).join('\n')}

Use the 'batchIsEnabled' tool to check all these feature flags at once. Based on the results, determine which features should be available and provide a summary of the application's behavior.

For each enabled feature, explain what functionality should be provided. For disabled features, explain what alternative behavior should be shown.`
      }
    }]
  };
}

/**
 * Prompt definition for batch feature flag check
 */
export const batchFlagCheckPrompt = {
  name: "checkMultipleFeatureFlags",
  paramsSchema: BatchFlagCheckParamsSchema,
  handler: handleBatchFlagCheckPrompt
};
