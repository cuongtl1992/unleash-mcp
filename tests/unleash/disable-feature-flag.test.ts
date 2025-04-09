import { disableFeatureFlag } from '../../src/unleash/disable-feature-flag.js';
import { client } from '../../src/unleash/unleash-client.js';
import { logger } from '../../src/logger.js';

// Mock dependencies
jest.mock('../../src/unleash/unleash-client.js', () => ({
  client: {
    post: jest.fn()
  }
}));

jest.mock('../../src/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('Disable Feature Flag API', () => {
  const mockProjectId = 'test-project';
  const mockFeatureName = 'test-feature';
  const mockEnvironment = 'development';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('disableFeatureFlag should call the correct API endpoint', async () => {
    // Mock successful response
    const mockResponse = { data: { success: true } };
    (client.post as jest.Mock).mockResolvedValue(mockResponse);
    
    // Call the function
    await disableFeatureFlag(mockProjectId, mockFeatureName, mockEnvironment);
    
    // Verify API call
    expect(client.post).toHaveBeenCalledWith(
      `/api/admin/projects/${mockProjectId}/features/${mockFeatureName}/environments/${mockEnvironment}/off`
    );
    
    // Verify logging
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`Successfully disabled feature flag '${mockFeatureName}'`)
    );
  });
  
  test('disableFeatureFlag should handle errors correctly', async () => {
    // Mock error response
    const mockError = new Error('API error');
    (client.post as jest.Mock).mockRejectedValue(mockError);
    
    // Call the function and expect it to throw
    await expect(
      disableFeatureFlag(mockProjectId, mockFeatureName, mockEnvironment)
    ).rejects.toThrow();
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error disabling feature flag '${mockFeatureName}'`),
      expect.any(Error)
    );
  });
}); 