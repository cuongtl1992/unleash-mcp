import { markFeaturesStale } from '../../src/unleash/mark-features-stale.js';
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

describe('Mark Features Stale API', () => {
  const mockProjectId = 'test-project';
  const mockFeatures = ['feature-1', 'feature-2', 'feature-3'];
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('markFeaturesStale should mark features as stale correctly', async () => {
    // Mock successful response
    const mockResponse = { data: { success: true } };
    (client.post as jest.Mock).mockResolvedValue(mockResponse);
    
    // Call the function to mark as stale
    await markFeaturesStale(mockProjectId, mockFeatures, true);
    
    // Verify API call
    expect(client.post).toHaveBeenCalledWith(
      `/api/admin/projects/${mockProjectId}/stale`,
      {
        features: mockFeatures,
        stale: true
      }
    );
    
    // Verify logging
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`Successfully marked ${mockFeatures.length} features as stale`)
    );
  });
  
  test('markFeaturesStale should mark features as not stale correctly', async () => {
    // Mock successful response
    const mockResponse = { data: { success: true } };
    (client.post as jest.Mock).mockResolvedValue(mockResponse);
    
    // Call the function to mark as not stale
    await markFeaturesStale(mockProjectId, mockFeatures, false);
    
    // Verify API call
    expect(client.post).toHaveBeenCalledWith(
      `/api/admin/projects/${mockProjectId}/stale`,
      {
        features: mockFeatures,
        stale: false
      }
    );
    
    // Verify logging
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`Successfully marked ${mockFeatures.length} features as not stale`)
    );
  });
  
  test('markFeaturesStale should handle errors correctly', async () => {
    // Mock error response
    const mockError = new Error('API error');
    (client.post as jest.Mock).mockRejectedValue(mockError);
    
    // Call the function and expect it to throw
    await expect(
      markFeaturesStale(mockProjectId, mockFeatures, true)
    ).rejects.toThrow();
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error marking features as stale`),
      expect.any(Error)
    );
  });
}); 