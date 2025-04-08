/**
 * HTTP transport for Unleash MCP Server
 */

import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import express from 'express';
import cors from 'cors';
import { config } from '../config.js';

/**
 * Create and start HTTP server with SSE transport
 * 
 * @param server The MCP server instance
 * @returns Promise that resolves when the server is started
 */
export async function startHttpTransport(server: McpServer): Promise<void> {
  console.log(`Starting Unleash MCP HTTP Server on port ${config.httpPort}`);
  
  // Create express application
  const app = express();
  app.use(cors());
  
  // Track active transports
  const transports: { [sessionId: string]: SSEServerTransport } = {};
  
  // Health check endpoint
  app.get('/health', (_, res) => {
    res.status(200).json({ 
      status: 'ok',
      transport: 'http',
      connections: Object.keys(transports).length
    });
  });
  
  // SSE endpoint for connecting to the MCP server
  app.get(`/sse`, async (_, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const transport = new SSEServerTransport(`/messages`, res);
    transports[transport.sessionId] = transport;
    
    res.on('close', () => {
      delete transports[transport.sessionId];
      console.log(`Client disconnected: ${transport.sessionId}`);
    });
    
    await server.connect(transport);
  });
  
  // Message endpoint for receiving client messages
  app.post(`/messages`, async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId];
    if (transport) {
      await transport.handlePostMessage(req, res);
    } else {
      res.status(400).send('No transport found for sessionId');
    }
  });
  
  // Start the HTTP server
  app.listen(config.httpPort, () => {
    console.log(`HTTP server listening on port ${config.httpPort}`);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('HTTP server shutting down');
    process.exit(0);
  });
}
