# Unleash MCP Server Specification

## Overview

The Unleash MCP Server is a specialized bridge that connects Large Language Models (LLMs) with Unleash's feature flag management system through the Model Context Protocol (MCP). This integration enables AI applications to access, evaluate, and manage feature flags, allowing for dynamic behavior control of AI systems based on feature flag configurations.

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Integration Patterns](#integration-patterns)
4. [Resources](#resources)
5. [Tools](#tools)
6. [Prompts](#prompts)
7. [Implementation Requirements](#implementation-requirements)
8. [Security Considerations](#security-considerations)
9. [Examples](#examples)

## Introduction

Feature flags are a powerful mechanism for controlling application behavior without code changes. By integrating Unleash's feature flag system with LLMs through the Model Context Protocol (MCP), we enable AI applications to:

- Check feature flag status to determine available capabilities
- Access feature flag metadata and configuration
- Update feature flag settings based on AI-driven insights
- Create and manage feature flags programmatically
- Track feature flag usage metrics

This integration empowers developers to control AI behavior dynamically, implement gradual rollouts of AI features, conduct A/B testing of AI responses, and quickly disable problematic AI capabilities without code deployment.

## Architecture

The Unleash MCP Server functions as a bridge between LLM applications and the Unleash feature flag system:

```
+----------------+      +-------------------+      +----------------+
|                |      |                   |      |                |
|  LLM App       | <--> |  Unleash MCP      | <--> |  Unleash API   |
|  (MCP Client)  |      |  Server           |      |  Server        |
|                |      |                   |      |                |
+----------------+      +-------------------+      +----------------+
```

The system consists of three main components:

1. **LLM Application (MCP Client)**: The AI application that needs access to feature flags
2. **Unleash MCP Server**: The bridge implementing the Model Context Protocol
3. **Unleash API Server**: The feature flag management system

The Unleash MCP Server exposes resources, tools, and prompts that follow the MCP specification, allowing standardized access to Unleash functionality.

## Integration Patterns

### Pattern 1: Feature-Controlled AI Behavior

Enable or disable specific AI behaviors based on feature flags:

```
1. User requests AI assistance
2. AI checks relevant feature flags via MCP
3. AI tailors its response based on enabled features
4. Metrics about feature usage are collected
```

### Pattern 2: Gradual AI Feature Rollout

Implement percentage-based rollouts of new AI capabilities:

```
1. New AI feature is developed but disabled by default
2. Feature flag is created with gradual rollout strategy
3. AI checks flag status for each user interaction
4. Feature is gradually exposed to increasing percentage of users
5. Metrics are collected to monitor adoption and issues
```

### Pattern 3: A/B Testing Different AI Approaches

Test different AI strategies with controlled user groups:

```
1. Multiple implementation approaches are developed
2. Feature flags are configured to segment users
3. AI checks flags to determine which approach to use
4. Metrics are collected to compare approaches
5. Best approach is selected based on data
```

## Resources

The Unleash MCP Server exposes the following resources for MCP clients:

### `unleash://flags`

Lists all available feature flags in the Unleash system.

**Description:** Retrieves a comprehensive list of all feature flags configured in Unleash, including their names, descriptions, enabled status, and basic configuration.

**Response Format:**
```json
[
  {
    "name": "premium-search",
    "description": "Enhanced search capabilities for premium users",
    "enabled": true,
    "strategies": [
      {
        "name": "userWithId",
        "parameters": {
          "userIds": "user1,user2,user3"
        }
      }
    ],
    "createdAt": "2023-06-15T10:30:00Z",
    "variants": [],
    "type": "release",
    "stale": false
  },
  // Additional flags...
]
```

**Example Usage:**
```typescript
const flagsResource = await client.readResource('unleash://flags');
const flags = JSON.parse(flagsResource.contents[0].text);
console.log(`Found ${flags.length} feature flags`);
```

### `unleash://flags/{flagName}`

Get detailed information about a specific feature flag.

**Description:** Retrieves comprehensive details about a specific feature flag, including its configuration, strategies, variants, and current status.

**Parameters:**
- `flagName`: The name of the feature flag to retrieve

**Response Format:**
```json
{
  "name": "premium-search",
  "description": "Enhanced search capabilities for premium users",
  "enabled": true,
  "strategies": [
    {
      "name": "userWithId",
      "parameters": {
        "userIds": "user1,user2,user3"
      }
    },
    {
      "name": "gradualRollout",
      "parameters": {
        "percentage": "20",
        "groupId": "premium-search"
      }
    }
  ],
  "variants": [
    {
      "name": "control",
      "weight": 50
    },
    {
      "name": "experiment",
      "weight": 50
    }
  ],
  "createdAt": "2023-06-15T10:30:00Z",
  "lastModifiedAt": "2023-06-20T14:15:00Z",
  "type": "experiment",
  "stale": false,
  "project": "default",
  "environments": ["development", "production"]
}
```

**Example Usage:**
```typescript
const flagResource = await client.readResource('unleash://flags/premium-search');
const flag = JSON.parse(flagResource.contents[0].text);
console.log(`Flag ${flag.name} is ${flag.enabled ? 'enabled' : 'disabled'}`);
```

### `unleash://strategies`

Lists all available activation strategies.

**Description:** Retrieves a list of all activation strategies configured in the Unleash system, including built-in strategies and any custom strategies.

**Response Format:**
```json
[
  {
    "name": "default",
    "description": "Default on/off strategy",
    "parameters": []
  },
  {
    "name": "userWithId",
    "description": "Enable for specific user IDs",
    "parameters": [
      {
        "name": "userIds",
        "description": "Comma-separated list of user IDs",
        "type": "string",
        "required": true
      }
    ]
  },
  {
    "name": "gradualRollout",
    "description": "Gradually enable for a percentage of users",
    "parameters": [
      {
        "name": "percentage",
        "description": "Percentage of users (0-100)",
        "type": "number",
        "required": true
      },
      {
        "name": "groupId",
        "description": "Group ID for the rollout",
        "type": "string",
        "required": true
      }
    ]
  },
  // Additional strategies...
]
```

**Example Usage:**
```typescript
const strategiesResource = await client.readResource('unleash://strategies');
const strategies = JSON.parse(strategiesResource.contents[0].text);
console.log(`Found ${strategies.length} activation strategies`);
```

### `unleash://metrics`

Get metrics about feature flag usage.

**Description:** Retrieves metrics about feature flag usage, including how many times each flag was evaluated, the distribution of yes/no outcomes, and which clients are using the flags.

**Response Format:**
```json
{
  "lastHour": {
    "flags": {
      "premium-search": {
        "yes": 120,
        "no": 480,
        "variants": {
          "control": 60,
          "experiment": 60
        }
      },
      "dark-mode": {
        "yes": 300,
        "no": 200,
        "variants": {}
      }
    },
    "clients": [
      {
        "appName": "web-app",
        "instanceId": "inst-1",
        "flagCounts": {
          "premium-search": 200,
          "dark-mode": 150
        }
      },
      {
        "appName": "mobile-app",
        "instanceId": "inst-2",
        "flagCounts": {
          "premium-search": 400,
          "dark-mode": 350
        }
      }
    ]
  },
  "lastDay": {
    // Similar structure to lastHour
  }
}
```

**Example Usage:**
```typescript
const metricsResource = await client.readResource('unleash://metrics');
const metrics = JSON.parse(metricsResource.contents[0].text);
const premiumSearchYes = metrics.lastHour.flags['premium-search'].yes;
console.log(`Premium search was enabled ${premiumSearchYes} times in the last hour`);
```

## Tools

The Unleash MCP Server provides the following tools for MCP clients:

### `staleFlag`

Mark a feature flag as stale.

**Description:** Marks a feature flag as stale in the Unleash system. Stale flags are typically those that are no longer actively used and could potentially be removed.

**Parameters:**
- `flagName`: String - The name of the feature flag to mark as stale

**Returns:**
```json
{
  "success": true,
  "flagName": "old-feature",
  "status": "stale",
  "message": "Feature flag 'old-feature' marked as stale successfully"
}
```

**Example Usage:**
```typescript
const result = await client.callTool({
  name: 'staleFlag',
  arguments: {
    flagName: 'old-feature'
  }
});

const response = JSON.parse(result.content[0].text);
console.log(response.message);
```

### `getFlag`

Show all information of a flag including state, strategies, settings, metrics, and event log.

**Description:** Retrieves comprehensive information about a feature flag, including its current state, configuration, activation strategies, usage metrics, and event history in a human-readable format.

**Parameters:**
- `flagName`: String - The name of the feature flag to get

**Returns:**
```json
{
  "flag": {
    "name": "premium-search",
    "description": "Enhanced search capabilities for premium users",
    "enabled": true,
    "strategies": [
      {
        "name": "userWithId",
        "parameters": {
          "userIds": "user1,user2,user3"
        }
      }
    ],
    "variants": [],
    "type": "release",
    "stale": false,
    "project": "default",
    "environments": ["development", "production"]
  },
  "metrics": {
    "lastHour": {
      "yes": 120,
      "no": 480,
      "variants": {}
    },
    "lastDay": {
      "yes": 2800,
      "no": 11200,
      "variants": {}
    }
  },
  "events": [
    {
      "type": "created",
      "createdBy": "admin",
      "createdAt": "2023-06-15T10:30:00Z"
    },
    {
      "type": "updated",
      "createdBy": "admin",
      "createdAt": "2023-06-20T14:15:00Z",
      "data": {
        "enabled": true
      }
    }
  ],
  "summary": "The premium-search flag is currently enabled. It uses userWithId strategy to target specific users. The flag has been evaluated 600 times in the last hour with 20% 'yes' outcomes."
}
```

**Example Usage:**
```typescript
const result = await client.callTool({
  name: 'getFlag',
  arguments: {
    flagName: 'premium-search'
  }
});

const response = JSON.parse(result.content[0].text);
console.log(response.summary);
```

### `isEnabled`

Check if a feature flag is enabled.

**Description:** Evaluates whether a feature flag is enabled for a given context. This is the core functionality that determines if a feature should be activated based on the flag's configuration and the provided context.

**Parameters:**
- `flagName`: String - The name of the feature flag to check
- `context`: Object (optional) - Context for evaluating the feature flag
  - `userId`: String (optional) - User ID for user-targeted strategies
  - `sessionId`: String (optional) - Session ID for session-based strategies
  - `remoteAddress`: String (optional) - IP address for geography-based strategies
  - `properties`: Object (optional) - Additional properties for custom strategies
  - `environment`: String (optional) - Environment (e.g., development, production)
  - `appName`: String (optional) - Application name

**Returns:**
```json
{
  "flagName": "premium-search",
  "isEnabled": true,
  "context": {
    "userId": "user123",
    "sessionId": "session-456",
    "environment": "production"
  },
  "variant": "experiment",
  "timestamp": "2023-09-01T14:23:45Z"
}
```

**Example Usage:**
```typescript
const result = await client.callTool({
  name: 'isEnabled',
  arguments: {
    flagName: 'premium-search',
    context: {
      userId: 'user123',
      environment: 'production'
    }
  }
});

const response = JSON.parse(result.content[0].text);
if (response.isEnabled) {
  console.log(`Feature ${response.flagName} is enabled for user`);
}
```

### `updateFlag`

Update a feature flag's configuration.

**Description:** Updates an existing feature flag's configuration, including its description, enabled status, strategies, and other properties.

**Parameters:**
- `flagName`: String - The name of the feature flag to update
- `config`: Object - The new configuration for the flag
  - `description`: String (optional) - Updated description
  - `enabled`: Boolean (optional) - Whether the flag should be enabled
  - `strategies`: Array (optional) - Updated activation strategies
  - `variants`: Array (optional) - Updated variants configuration
  - `type`: String (optional) - Flag type (e.g., release, experiment, operational)

**Returns:**
```json
{
  "success": true,
  "flagName": "premium-search",
  "message": "Feature flag 'premium-search' updated successfully",
  "changes": {
    "enabled": {
      "from": false,
      "to": true
    },
    "description": {
      "from": "Premium search feature",
      "to": "Enhanced search capabilities for premium users"
    }
  }
}
```

**Example Usage:**
```typescript
const result = await client.callTool({
  name: 'updateFlag',
  arguments: {
    flagName: 'premium-search',
    config: {
      description: 'Enhanced search capabilities for premium users',
      enabled: true,
      strategies: [
        {
          name: 'gradualRollout',
          parameters: {
            percentage: '50',
            groupId: 'premium-search'
          }
        }
      ]
    }
  }
});

const response = JSON.parse(result.content[0].text);
console.log(response.message);
```

### `createFlag`

Create a new feature flag.

**Description:** Creates a new feature flag in the Unleash system with the specified configuration.

**Parameters:**
- `flagName`: String - The name of the new feature flag
- `config`: Object - The configuration for the flag
  - `description`: String - Description of the feature flag
  - `enabled`: Boolean - Whether the flag should be enabled initially
  - `strategies`: Array - Activation strategies for the flag
  - `variants`: Array (optional) - Variants configuration
  - `type`: String (optional) - Flag type (e.g., release, experiment, operational)
  - `project`: String (optional) - Project the flag belongs to
  - `environments`: Array (optional) - Environments where the flag is available

**Returns:**
```json
{
  "success": true,
  "flagName": "new-feature",
  "message": "Feature flag 'new-feature' created successfully",
  "flag": {
    "name": "new-feature",
    "description": "A brand new feature flag",
    "enabled": false,
    "strategies": [
      {
        "name": "default",
        "parameters": {}
      }
    ],
    "variants": [],
    "type": "release",
    "project": "default",
    "environments": ["development"]
  }
}
```

**Example Usage:**
```typescript
const result = await client.callTool({
  name: 'createFlag',
  arguments: {
    flagName: 'new-feature',
    config: {
      description: 'A brand new feature flag',
      enabled: false,
      strategies: [
        {
          name: 'default',
          parameters: {}
        }
      ],
      type: 'release',
      project: 'default',
      environments: ['development']
    }
  }
});

const response = JSON.parse(result.content[0].text);
console.log(response.message);
```

## Prompts

The Unleash MCP Server provides the following prompts for MCP clients:

### `flagEvaluation`

A prompt template for evaluating feature flags with context.

**Description:** This prompt guides an LLM through the process of evaluating a feature flag with a specific context, interpreting the results, and determining the appropriate actions to take based on the flag's status.

**Parameters:**
- `flagName`: String - The name of the feature flag to evaluate
- `context`: Object - Context for evaluating the feature flag
  - `userId`: String (optional) - User ID
  - `sessionId`: String (optional) - Session ID
  - `remoteAddress`: String (optional) - IP address
  - `properties`: Object (optional) - Additional properties
  - `environment`: String (optional) - Environment
  - `appName`: String (optional) - Application name

**Prompt Template:**
```
You need to determine if the feature flag '{flagName}' is enabled for the given context:

{context JSON}

Please follow these steps:
1. Use the 'isEnabled' tool to check if the feature flag is enabled with the provided context
2. Interpret the result to determine if the feature should be accessible
3. Explain what functionality should be provided based on the flag status
4. If the feature is disabled, describe what alternative behavior should be shown

Based on the feature flag status, provide a concise explanation of how the application should behave.
```

**Example Response:**
```
I'll check if the 'premium-search' feature flag is enabled for this context.

After checking the feature flag status, I can confirm that 'premium-search' is ENABLED for this user.

This means the application should:
1. Display the enhanced search interface with advanced filtering options
2. Enable real-time search suggestions
3. Allow searching within document contents
4. Show the premium search badge to indicate the feature is active

The user should have full access to all premium search capabilities based on their user profile and subscription status.
```

**Example Usage:**
```typescript
const promptResult = await client.getPrompt('flagEvaluation', {
  flagName: 'premium-search',
  context: {
    userId: 'user123',
    environment: 'production',
    properties: {
      subscriptionTier: 'premium'
    }
  }
});

// The returned prompt can be sent to an LLM
console.log(promptResult.messages[0].content.text);
```

## Implementation Requirements

### Technical Requirements

1. **MCP Compatibility**: Must fully implement the Model Context Protocol specification
2. **Unleash SDK Integration**: Must integrate with the official Unleash client SDK
3. **Transport Options**: Must support both stdio and HTTP/SSE transports
4. **Error Handling**: Must provide clear error messages and proper error handling
5. **Authentication**: Must support Unleash API token authentication
6. **Concurrent Connections**: Must support multiple simultaneous client connections
7. **Performance**: Must handle at least 100 feature flag evaluations per second

### Non-functional Requirements

1. **Documentation**: Comprehensive documentation with examples must be provided
2. **Testing**: Automated tests must cover all core functionality
3. **Security**: Must follow security best practices for MCP servers
4. **Logging**: Must provide configurable logging for operations
5. **Metrics**: Must collect performance metrics for monitoring
6. **Configuration**: Must support configuration via environment variables

## Security Considerations

1. **API Token Security**: Unleash API tokens should be securely stored and never exposed
2. **Transport Security**: When using HTTP transport, TLS should be used to encrypt communications
3. **Access Control**: Only authorized MCP clients should be allowed to connect
4. **Input Validation**: All inputs from MCP clients should be validated
5. **Output Sanitization**: Sensitive information should be removed from responses
6. **Rate Limiting**: Implement rate limiting to prevent abuse
7. **Audit Logging**: Log all significant actions for audit purposes

## Examples

### Example 1: Checking a Feature Flag

```typescript
// Connect to the Unleash MCP Server
const client = new Client(
  { name: 'my-llm-app', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

await client.connect(transport);

// Check if a feature flag is enabled
const result = await client.callTool({
  name: 'isEnabled',
  arguments: {
    flagName: 'ai-advanced-reasoning',
    context: {
      userId: 'user-123',
      environment: 'production'
    }
  }
});

// Parse the response
const response = JSON.parse(result.content[0].text);

// Use the result to determine AI behavior
if (response.isEnabled) {
  // Enable advanced reasoning capabilities
  aiConfig.enableAdvancedReasoning = true;
} else {
  // Use basic reasoning capabilities
  aiConfig.enableAdvancedReasoning = false;
}
```

### Example 2: Creating a Feature Flag

```typescript
// Connect to the Unleash MCP Server
const client = new Client(
  { name: 'feature-manager', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

await client.connect(transport);

// Create a new feature flag
const result = await client.callTool({
  name: 'createFlag',
  arguments: {
    flagName: 'ai-sentiment-analysis',
    config: {
      description: 'Enable AI sentiment analysis in responses',
      enabled: false, // Disabled by default
      strategies: [
        {
          name: 'gradualRollout',
          parameters: {
            percentage: '10',
            groupId: 'ai-sentiment-analysis'
          }
        }
      ],
      type: 'experiment',
      environments: ['development', 'staging']
    }
  }
});

// Parse the response
const response = JSON.parse(result.content[0].text);
console.log(response.message);
```

### Example 3: Using the Flag Evaluation Prompt

```typescript
// Connect to the Unleash MCP Server
const client = new Client(
  { name: 'ai-assistant', version: '1.0.0' },
  { capabilities: { prompts: {} } }
);

await client.connect(transport);

// Get the flag evaluation prompt
const promptResult = await client.getPrompt('flagEvaluation', {
  flagName: 'customer-service-tone',
  context: {
    userId: 'customer-456',
    properties: {
      customerTier: 'premium',
      region: 'europe'
    },
    environment: 'production'
  }
});

// Send the prompt to your LLM
const llmResponse = await getLLMResponse(promptResult.messages[0].content.text);
console.log(llmResponse);
```
