import { createFeatureFlag } from '../src/unleash/create-feature-flag.js';
import { handleCreateFlag } from '../src/tools/create-flag.js';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Mock client from unleash-client.js
jest.mock('../src/unleash/unleash-client.js', () => ({
  client: {
    post: jest.fn()
  }
}));

// Mock logger
jest.mock('../src/logger.js', () => ({
  logger: {
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('Create Feature Flag API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createFeatureFlag should create a feature flag', async () => {
    // Setup mock response
    const mockResponse = {
      data: {
        name: 'test-flag',
        project: 'default',
        enabled: false
      }
    };
    
    const client = require('../src/unleash/unleash-client.js').client;
    client.post.mockResolvedValue(mockResponse);

    // Call the function
    const result = await createFeatureFlag({
      name: 'test-flag',
      project: 'default',
      description: 'Test flag description'
    });

    // Check the results
    expect(client.post).toHaveBeenCalledWith(
      '/api/admin/projects/default/features',
      {
        name: 'test-flag',
        description: 'Test flag description',
        type: 'release',
        impressionData: false
      }
    );
    expect(result).toEqual(mockResponse.data);
  });

  test('createFeatureFlag should handle errors', async () => {
    const client = require('../src/unleash/unleash-client.js').client;
    client.post.mockRejectedValue(new Error('API error'));

    const result = await createFeatureFlag({
      name: 'test-flag',
      project: 'default'
    });

    expect(result).toBeNull();
  });
});

describe('Create Feature Flag Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handleCreateFlag should return success response', async () => {
    // Mock the createFeatureFlag function
    jest.spyOn(require('../src/unleash/create-feature-flag.js'), 'createFeatureFlag')
      .mockResolvedValue({
        name: 'test-flag',
        project: 'default',
        enabled: false
      });

    // Call the handler
    const response = await handleCreateFlag({
      name: 'test-flag',
      project: 'default',
      description: 'Test flag description'
    });

    // Verify response
    expect(response.content[0].type).toBe('text');
    const content = JSON.parse(response.content[0].text);
    expect(content.success).toBe(true);
    expect(content.message).toContain('Successfully created');
  });

  test('handleCreateFlag should handle errors', async () => {
    // Mock createFeatureFlag to return null (failure)
    jest.spyOn(require('../src/unleash/create-feature-flag.js'), 'createFeatureFlag')
      .mockResolvedValue(null);

    // Call the handler
    const response = await handleCreateFlag({
      name: 'test-flag',
      project: 'default'
    });

    // Verify error response
    expect(response.isError).toBe(true);
    const content = JSON.parse(response.content[0].text);
    expect(content.success).toBe(false);
    expect(content.error).toContain('Failed to create');
  });
}); 