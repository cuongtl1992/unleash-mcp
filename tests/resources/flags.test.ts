import { describe, expect, jest, test } from '@jest/globals';
import { handleFlagsList, handleFlagDetails } from '../../src/resources/flags.js';

// Mock the unleash client utils
jest.mock('../../src/utils/unleash-client.js', () => {
  // Sample feature flags
  const flags = [
    {
      name: 'test-flag-1',
      description: 'Test flag 1',
      enabled: true,
      strategies: [{ name: 'default' }]
    },
    {
      name: 'test-flag-2',
      description: 'Test flag 2',
      enabled: false,
      strategies: [{ 
        name: 'userWithId',
        parameters: { userIds: 'user1,user2' } 
      }]
    }
  ];
  
  return {
    isUnleashClientReady: jest.fn(() => true),
    getAllFeatureFlags: jest.fn(() => flags),
    getFeatureFlag: jest.fn((flagName) => 
      flags.find(flag => flag.name === flagName) || null
    )
  };
});

describe('Flag Resources', () => {
  describe('handleFlagsList', () => {
    test('should return all flags when client is ready', async () => {
      const result = await handleFlagsList(new URL('unleash://flags'));
      
      expect(result).toHaveProperty('contents');
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0]).toHaveProperty('uri');
      expect(result.contents[0]).toHaveProperty('text');
      
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(Array.isArray(parsedContent)).toBe(true);
      expect(parsedContent).toHaveLength(2);
      expect(parsedContent[0]).toHaveProperty('name', 'test-flag-1');
      expect(parsedContent[1]).toHaveProperty('name', 'test-flag-2');
    });
    
    test('should return error when client is not ready', async () => {
      // Mock client not ready for this test
      const mockIsReady = require('../../src/utils/unleash-client.js').isUnleashClientReady;
      mockIsReady.mockImplementationOnce(() => false);
      
      const result = await handleFlagsList(new URL('unleash://flags'));
      
      expect(result).toHaveProperty('contents');
      expect(result.contents).toHaveLength(1);
      
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent).toHaveProperty('error');
      expect(parsedContent.error).toContain('not ready');
    });
  });
  
  describe('handleFlagDetails', () => {
    test('should return specific flag details when flag exists', async () => {
      const result = await handleFlagDetails(
        new URL('unleash://flags/test-flag-1'), 
        { flagName: 'test-flag-1' }
      );
      
      expect(result).toHaveProperty('contents');
      expect(result.contents).toHaveLength(1);
      
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent).toHaveProperty('name', 'test-flag-1');
      expect(parsedContent).toHaveProperty('description', 'Test flag 1');
      expect(parsedContent).toHaveProperty('enabled', true);
    });
    
    test('should return error when flag does not exist', async () => {
      const result = await handleFlagDetails(
        new URL('unleash://flags/non-existent'), 
        { flagName: 'non-existent' }
      );
      
      expect(result).toHaveProperty('contents');
      expect(result.contents).toHaveLength(1);
      
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent).toHaveProperty('error');
      expect(parsedContent.error).toContain('not found');
    });
    
    test('should return error when client is not ready', async () => {
      // Mock client not ready for this test
      const mockIsReady = require('../../src/utils/unleash-client.js').isUnleashClientReady;
      mockIsReady.mockImplementationOnce(() => false);
      
      const result = await handleFlagDetails(
        new URL('unleash://flags/test-flag-1'), 
        { flagName: 'test-flag-1' }
      );
      
      expect(result).toHaveProperty('contents');
      expect(result.contents).toHaveLength(1);
      
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent).toHaveProperty('error');
      expect(parsedContent.error).toContain('not ready');
    });
  });
}); 