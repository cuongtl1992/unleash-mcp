/**
 * Feature flag evaluation prompt for Unleash MCP Server
 */

import { z } from 'zod';

/**
 * Define the unleash context schema based on its documentation
 */
const UnleashContextSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  remoteAddress: z.string().optional(),
  properties: z.record(z.any()).optional(),
  environment: z.string().optional(),
  appName: z.string().optional()
}).passthrough();

/**
 * Parameters schema for the feature flag evaluation prompt
 */
export const FlagEvaluationParamsSchema = {
  flagName: z.string(),
  context: UnleashContextSchema.optional()
};

/**
 * Handler for the feature flag evaluation prompt
 */
export function handleFlagEvaluationPrompt({ flagName, context = {} }: { flagName: string; context?: Record<string, any> }) {
  return {
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `You need to determine if the feature flag '${flagName}' is enabled for the given context:

${JSON.stringify(context, null, 2)}

Please follow these steps:
1. Use the 'isEnabled' tool to check if the feature flag is enabled with the provided context
2. Interpret the result to determine if the feature should be accessible
3. Explain what functionality should be provided based on the flag status
4. If the feature is disabled, describe what alternative behavior should be shown

Based on the feature flag status, provide a concise explanation of how the application should behave.`
      }
    }]
  };
}

/**
 * Prompt definition for feature flag evaluation
 */
export const flagEvaluationPrompt = {
  name: "flagEvaluation",
  paramsSchema: FlagEvaluationParamsSchema,
  handler: handleFlagEvaluationPrompt
}; 