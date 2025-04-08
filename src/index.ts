/**
 * Main entry point for Unleash MCP Server
 */

import { config } from './config.js';
import { createMcpServer } from './server.js';
import { startStdioTransport } from './transport/stdio.js';
import { startHttpTransport } from './transport/http.js';

/**
 * Start the Unleash MCP Server
 */
async function main() {
  try {
    // Create MCP server
    const server = createMcpServer();

    // Start with appropriate transport
    if (config.transport === 'http') {
      await startHttpTransport(server);
    } else {
      await startStdioTransport(server);
    }
    
    console.log('Unleash MCP Server started successfully');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('Shutting down Unleash MCP Server...');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.log('Shutting down Unleash MCP Server...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Failed to start Unleash MCP Server:', error);
    process.exit(1);
  }
}

// Run the server
main();
