# Unleash MCP Server

A Model Context Protocol (MCP) server implementation that integrates with Unleash Feature Toggle system.

## Overview

This project provides a bridge between LLM applications and Unleash feature flag system using the Model Context Protocol (MCP). It allows AI applications to:

1. Check feature flag status from Unleash
2. Expose feature flag information to LLMs
3. Create feature flag
4. Update feature flag
5. List all projects

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Requirements

- Node.js (v18 or higher)
- TypeScript (v5.0 or higher)
- Access to an Unleash server instance

## Installation

```bash
# Install dependencies
npm i
```

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
│   ├── server.ts             # Server implementation
│   ├── config.ts             # Configuration handling
│   ├── transport/            # MCP transport implementations
│   │   ├── http.ts           # HTTP/SSE transport
│   │   └── stdio.ts          # STDIO transport
│   ├── unleash/              # Unleash API client implementations
│   │   ├── unleash-client.ts # Main Unleash client
│   │   ├── get-feature-flag.ts
│   │   └── get-all-projects.ts
│   ├── resources/            # MCP resource implementations
│   │   ├── flags.ts          # Feature flag resources
│   │   └── projects.ts       # Project resources
│   ├── tools/                # MCP tool implementations
│   │   ├── get-flag.ts       # Get feature flag tool
│   │   └── get-projects.ts   # Get projects tool
│   └── prompts/              # MCP prompt implementations
│       ├── flag-check.ts     # Check single flag
│       └── batch-flag-check.ts # Check multiple flags
├── tests/                    # Tests
└── package.json              # Project configuration
```

### Coding Standards

- **Naming Conventions**:
  - Files: Use kebab-case.ts (e.g., `feature-flag.ts`)
  - Classes: Use PascalCase (e.g., `UnleashClient`)
  - Functions/Methods: Use camelCase (e.g., `getFlagStatus`)
  - Interfaces/Types: Use PascalCase (e.g., `FeatureFlagConfig`)

- **Imports**:
  - Always include .js extension when importing local files
  - Follow import ordering: Node.js built-ins → External dependencies → Local imports
  - Use named exports over default exports

- **Documentation**:
  - Use JSDoc comments for public functions, classes, and interfaces
  - Document complex logic with inline comments

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

### Inspecting
```bash
# MCP stdio inspect
npm run build
npx @modelcontextprotocol/inspector node dist/index.js

# MCP sse inspect
npm start
npx @modelcontextprotocol/inspector
```

## How to use

For Claude or Cursor config:
```json
{
  "mcpServers": {
    "unleash": {
      "command": "npx",
      "args": [
        "unleash-mcp"
      ],
      "env": {
        "UNLEASH_URL": "YOUR_UNLEASH_END_POINT",
        "UNLEASH_API_TOKEN": "YOUR_UNLEASH_API_TOKEN",
        "MCP_TRANSPORT": "stdio",
        "MCP_HTTP_PORT": 3001
      }
    }
  }
}
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