import { describe, expect, jest, test } from '@jest/globals';
import { handleIsEnabled } from '../../src/tools/is-enabled.js';

// Define interface for context
interface UnleashContext {
  userId?: string;
  sessionId?: string;
  remoteAddress?: string;
  properties?: Record<string, string>;
  environment?: string;
  appName?: string;
  [key: string]: any;
}

// Mock the unleash client
jest.mock('../../src/utils/unleash-client.js', () => ({
  getUnleashClient: jest.fn(() => ({
    isEnabled: jest.fn((flagName: string, context: UnleashContext) => {
      // Simple mock implementation
      if (flagName === 'existing-flag') {
        return true;
      }
      if (flagName === 'user-targeting' && context && context.userId === 'user-123') {
        return true;
      }
      return false;
    })
  }))
}));

describe('isEnabled Tool', () => {
  test('should return true for enabled flag', async () => {
    const result = await handleIsEnabled({ flagName: 'existing-flag', context: {} });
    
    expect(result).toHaveProperty('content');
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    
    const parsedContent = JSON.parse(result.content[0].text);
    expect(parsedContent.isEnabled).toBe(true);
    expect(parsedContent.flagName).toBe('existing-flag');
  });
  
  test('should return false for disabled flag', async () => {
    const result = await handleIsEnabled({ flagName: 'non-existing-flag', context: {} });
    
    expect(result).toHaveProperty('content');
    expect(result.content).toHaveLength(1);
    
    const parsedContent = JSON.parse(result.content[0].text);
    expect(parsedContent.isEnabled).toBe(false);
    expect(parsedContent.flagName).toBe('non-existing-flag');
  });
  
  test('should consider context in flag evaluation', async () => {
    // Test with user that has access
    const resultEnabled = await handleIsEnabled({ 
      flagName: 'user-targeting', 
      context: { userId: 'user-123' } 
    });
    
    const parsedContentEnabled = JSON.parse(resultEnabled.content[0].text);
    expect(parsedContentEnabled.isEnabled).toBe(true);
    
    // Test with user that doesn't have access
    const resultDisabled = await handleIsEnabled({ 
      flagName: 'user-targeting', 
      context: { userId: 'user-456' } 
    });
    
    const parsedContentDisabled = JSON.parse(resultDisabled.content[0].text);
    expect(parsedContentDisabled.isEnabled).toBe(false);
  });
  
  test('should handle errors gracefully', async () => {
    // Force an error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const mockGetUnleashClient = require('../../src/utils/unleash-client.js').getUnleashClient;
    mockGetUnleashClient.mockImplementationOnce(() => {
      throw new Error('Unleash client error');
    });
    
    const result = await handleIsEnabled({ flagName: 'any-flag', context: {} });
    
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('isError', true);
    
    const parsedContent = JSON.parse(result.content[0].text);
    expect(parsedContent.error).toBe('Unleash client error');
    
    consoleErrorSpy.mockRestore();
  });
}); 