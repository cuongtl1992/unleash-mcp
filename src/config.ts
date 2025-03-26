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
  unleashToken: z.string(),
  appName: z.string().default('unleash-mcp-server'),
  instanceId: z.string().optional(),
  refreshInterval: z.number().positive().default(15000),
  metricsInterval: z.number().positive().default(60000),
  
  // MCP configuration
  transport: z.enum(['stdio', 'http']).default('stdio'),
  httpPort: z.number().positive().default(3000),
  httpPath: z.string().default('/mcp'),
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): Config {
  // Load from environment variables
  const config = {
    unleashUrl: process.env.UNLEASH_URL,
    unleashToken: process.env.UNLEASH_API_TOKEN,
    appName: process.env.UNLEASH_APP_NAME,
    instanceId: process.env.UNLEASH_INSTANCE_ID,
    refreshInterval: process.env.UNLEASH_REFRESH_INTERVAL 
      ? parseInt(process.env.UNLEASH_REFRESH_INTERVAL, 10) 
      : undefined,
    metricsInterval: process.env.UNLEASH_METRICS_INTERVAL 
      ? parseInt(process.env.UNLEASH_METRICS_INTERVAL, 10) 
      : undefined,
    transport: process.env.MCP_TRANSPORT as 'stdio' | 'http' | undefined,
    httpPort: process.env.HTTP_PORT 
      ? parseInt(process.env.HTTP_PORT, 10) 
      : undefined,
    httpPath: process.env.HTTP_PATH,
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
