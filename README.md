# Unleash MCP Server

A Model Context Protocol (MCP) server implementation that integrates with Unleash Feature Toggle system.

## Overview

This project provides a bridge between LLM applications and Unleash feature flag system using the Model Context Protocol (MCP). It allows AI applications to:

1. Check feature flag status from Unleash
2. Expose feature flag information to LLMs
3. Update feature flag configurations
4. Collect metrics on feature flag usage

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Features](#features)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Requirements

- Node.js (v18 or higher)
- TypeScript (v4.5 or higher)
- Access to an Unleash server instance

## Installation

```bash
# Create a new directory
mkdir unleash-mcp-server
cd unleash-mcp-server

# Install dependencies
npm install @modelcontextprotocol/sdk unleash-client typescript ts-node express

# Install development dependencies
npm install --save-dev @types/node @types/express
```

## Getting Started

1. Create a basic Unleash MCP server:

```typescript
// src/index.ts
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { initialize as initializeUnleash } from 'unleash-client';
import { z } from "zod";

// Initialize Unleash client
const unleash = initializeUnleash({
  url: 'https://YOUR-UNLEASH-API-URL',
  appName: 'unleash-mcp-server',
  customHeaders: { Authorization: 'YOUR-UNLEASH-API-TOKEN' },
});

// Create an MCP server
const server = new McpServer({
  name: "UnleashMCP",
  version: "1.0.0"
});

// Add a tool to check if a feature flag is enabled
server.tool("isEnabled",
  { 
    flagName: z.string(), 
    context: z.record(z.any()).optional() 
  },
  async ({ flagName, context = {} }) => {
    const isEnabled = unleash.isEnabled(flagName, context);
    
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({ 
          flagName, 
          isEnabled,
          timestamp: new Date().toISOString()
        })
      }]
    };
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
```

2. Run the server:

```bash
ts-node src/index.ts
```

3. Connect to the server using an MCP client.

## Architecture

The Unleash MCP Server acts as a bridge between LLM applications and the Unleash feature flag system:

```
+----------------+      +-------------------+      +----------------+
|                |      |                   |      |                |
|  LLM App       | <--> |  Unleash MCP      | <--> |  Unleash API   |
|  (MCP Client)  |      |  Server           |      |  Server        |
|                |      |                   |      |                |
+----------------+      +-------------------+      +----------------+
```

## Features

- **Feature Flag Status**: Check if feature flags are enabled/disabled
- **Flag Definition Access**: Access metadata about feature flags
- **Context-Aware Evaluation**: Evaluate flags with specific contexts
- **Metrics Collection**: Track feature flag usage metrics
- **Flag Management**: Create, update, and stale feature flags

## API Reference

### Resources

#### `unleash://flags`

Lists all available feature flags.

#### `unleash://flags/{flagName}`

Get detailed information about a specific feature flag.

#### `unleash://strategies`

Lists all available activation strategies.

#### `unleash://metrics`

Get metrics about feature flag usage.

### Tools

#### `isEnabled`

Check if a feature flag is enabled.

Parameters:
- `flagName`: String - The name of the feature flag to check
- `context`: Object (optional) - Context for evaluating the feature flag

Returns:
- Object with flag status information

#### `batchIsEnabled`

Check multiple feature flags at once.

Parameters:
- `flagNames`: Array - The names of the feature flags to check
- `context`: Object (optional) - Context for evaluating the feature flags

Returns:
- Object with status information for all requested flags

#### `getFlag`

Get detailed information about a feature flag including its configuration, metrics, and event history.

Parameters:
- `flagName`: String - The name of the feature flag to get

Returns:
- Object with detailed flag information including status, metrics, and history

#### `updateFlag`

Update a feature flag's configuration.

Parameters:
- `flagName`: String - The name of the feature flag to update
- `config`: Object - The new configuration for the flag, which can include:
  - `description`: String - Description of the flag
  - `enabled`: Boolean - Whether the flag is enabled
  - `strategies`: Array - Activation strategies
  - `variants`: Array - Flag variants
  - `type`: String - Flag type (e.g., 'release', 'experiment', 'operational')

Returns:
- Object with update status information

#### `createFlag`

Create a new feature flag.

Parameters:
- `flagName`: String - The name of the new feature flag
- `config`: Object - The configuration for the flag, which must include:
  - `description`: String - Description of the flag
  - `enabled`: Boolean - Whether the flag is enabled
  - `strategies`: Array - Activation strategies
  - Can also include:
    - `variants`: Array - Flag variants
    - `type`: String - Flag type
    - `project`: String - Project name
    - `environments`: Array - Environments

Returns:
- Object with creation status information

#### `staleFlag`

Mark a feature flag as stale, indicating it's no longer actively used.

Parameters:
- `flagName`: String - The name of the feature flag to mark as stale

Returns:
- Object with status information

### Prompts

#### `checkFeatureFlag`

A prompt template for checking if a feature flag is enabled.

Parameters:
- `flagName`: String - The name of the feature flag to check
- `context`: Object (optional) - Context for evaluating the feature flag

#### `batchFlagCheck`

A prompt template for checking multiple feature flags at once.

Parameters:
- `flagNames`: Array - The names of the feature flags to check
- `context`: Object (optional) - Context for evaluating the feature flags

#### `flagEvaluation`

A prompt template for evaluating feature flags with context and providing detailed guidance on behavior.

Parameters:
- `flagName`: String - The name of the feature flag to evaluate
- `context`: Object - Context for evaluating the feature flag

## Configuration

Configuration options for the Unleash MCP Server:

| Option | Description | Default |
|--------|-------------|---------|
| `unleashUrl` | URL of the Unleash API server | - |
| `unleashToken` | API token for authenticating with Unleash | - |
| `appName` | Name of the application in Unleash | `unleash-mcp-server` |
| `refreshInterval` | Interval for polling Unleash API (ms) | `15000` |
| `metricsInterval` | Interval for sending metrics (ms) | `60000` |
| `transport` | MCP transport type (stdio, http) | `stdio` |
| `httpPort` | Port for HTTP transport | `3000` |

## Development

### Project Structure

```
unleash-mcp-server/
├── src/
│   ├── index.ts              # Main entry point
│   ├── config.ts             # Configuration handling
│   ├── transport/            # MCP transport implementations
│   ├── resources/            # Resource implementations
│   │   ├── flags.ts
│   │   ├── strategies.ts
│   │   └── metrics.ts
│   ├── tools/                # Tool implementations
│   │   ├── is-enabled.ts
│   │   ├── update-flag.ts
│   │   └── create-flag.ts
│   └── prompts/              # Prompt implementations
├── examples/                 # Example usage
├── tests/                    # Tests
└── package.json
```

### Building

```bash
# Compile TypeScript
npm run build

# Run the server
npm start
```

### Testing

```bash
# Run tests
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support the Project

If you find this project helpful, consider buying me a coffee!

<p align="center">
  <img src="https://raw.githubusercontent.com/cuongtl1992/mcp-dbs/main/assets/bmc_qr.png" alt="Buy Me A Coffee QR Code" width="200">
</p>

Scan the QR code above or [click here](https://www.buymeacoffee.com/cuongtl1992) to support the development of this project.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
ß