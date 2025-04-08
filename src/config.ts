/**
 * Configuration module for Unleash MCP Server
 */

import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define configuration schema
const ConfigSchema = z.object({
  // Unleash configuration
  unleashUrl: z.string().url(),
  apiToken: z.string(),
  
  // MCP configuration
  transport: z.enum(['stdio', 'http']).default('stdio'),
  httpPort: z.number().positive().default(3001)
});

/**
 * Load and validate configuration from environment variables
 */
function loadConfig(): Config {
  // Load from environment variables
  const config = {
    unleashUrl: process.env.UNLEASH_URL,
    apiToken: process.env.UNLEASH_API_TOKEN,
    transport: process.env.MCP_TRANSPORT as 'stdio' | 'http' | undefined,
    httpPort: process.env.MCP_HTTP_PORT 
      ? parseInt(process.env.MCP_HTTP_PORT, 10) 
      : 3001
  };

  // Filter out undefined values
  const filteredConfig = Object.fromEntries(
    Object.entries(config).filter(([_, v]) => v !== undefined)
  );

  try {
    // Validate and return configuration
    return ConfigSchema.parse(filteredConfig);
  } catch (error) {
    console.error('Invalid configuration:', error);
    process.exit(1);
  }
}

export type Config = z.infer<typeof ConfigSchema>;
export const config: Config = loadConfig();