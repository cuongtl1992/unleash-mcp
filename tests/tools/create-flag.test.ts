import { describe, expect, jest, test } from '@jest/globals';
import { handleCreateFlag } from '../../src/tools/create-flag.js';

// Mock the unleash client
jest.mock('../../src/utils/unleash-client.js', () => {
  const existingFlags = new Map();
  existingFlags.set('existing-flag', { name: 'existing-flag' });
  
  return {
    getUnleashClient: jest.fn(() => ({
      // Mock repository access
      repository: {
        getToggle: jest.fn((flagName) => existingFlags.get(flagName) || null)
      }
    }))
  };
});

describe('createFlag Tool', () => {
  test('should create a new flag successfully', async () => {
    const flagName = 'new-feature-flag';
    const config = {
      description: 'A new feature flag',
      enabled: true,
      strategies: [
        {
          name: 'default'
        }
      ]
    };
    
    const result = await handleCreateFlag({ flagName, config });
    
    expect(result).toHaveProperty('content');
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    
    const parsedContent = JSON.parse(result.content[0].text);
    expect(parsedContent.success).toBe(true);
    expect(parsedContent.flagName).toBe(flagName);
    expect(parsedContent.flag).toHaveProperty('name', flagName);
    expect(parsedContent.flag).toHaveProperty('description', config.description);
    expect(parsedContent.flag).toHaveProperty('enabled', config.enabled);
  });
  
  test('should fail if flag already exists', async () => {
    const flagName = 'existing-flag';
    const config = {
      description: 'Trying to create an existing flag',
      enabled: true,
      strategies: [
        {
          name: 'default'
        }
      ]
    };
    
    const result = await handleCreateFlag({ flagName, config });
    
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('isError', true);
    
    const parsedContent = JSON.parse(result.content[0].text);
    expect(parsedContent.success).toBe(false);
    expect(parsedContent.error).toContain('already exists');
  });
  
  test('should handle errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const mockGetUnleashClient = require('../../src/utils/unleash-client.js').getUnleashClient;
    mockGetUnleashClient.mockImplementationOnce(() => {
      throw new Error('Unleash client error');
    });
    
    const result = await handleCreateFlag({ 
      flagName: 'any-flag', 
      config: {
        description: 'Test flag',
        enabled: true,
        strategies: []
      }
    });
    
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('isError', true);
    
    const parsedContent = JSON.parse(result.content[0].text);
    expect(parsedContent.error).toBe('Unleash client error');
    
 