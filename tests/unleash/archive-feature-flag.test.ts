import { archiveFeatureFlag } from '../../src/unleash/archive-feature-flag.js';
import { client } from '../../src/unleash/unleash-client.js';
import { logger } from '../../src/logger.js';

// Mock dependencies
jest.mock('../../src/unleash/unleash-client.js', () => ({
  client: {
    delete: jest.fn()
  }
}));

jest.mock('../../src/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('Archive Feature Flag API', () => {
  const mockProjectId = 'test-project';
  const mockFeatureName = 'test-feature';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('archiveFeatureFlag should call the correct API endpoint', async () => {
    // Mock successful response
    const mockResponse = { 
      status: 202,
      data: {}
    };
    (client.delete as jest.Mock).mockResolvedValue(mockResponse);
    
    // Call the function
    const result = await archiveFeatureFlag(mockProjectId, mockFeatureName);
    
    // Verify API call
    expect(client.delete).toHaveBeenCalledWith(
      `/api/admin/projects/${mockProjectId}/features/${mockFeatureName}`
    );
    
    // Verify result
    expect(result).toBe(true);
    
    // Verify logging
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`Successfully archived feature ${mockFeatureName} from project ${mockProjectId}`)
    );
  });
  
  test('archiveFeatureFlag should return false when feature not found', async () => {
    // Mock 404 error response
    const mockError = {
      response: {
        status: 404
      }
    };
    (client.delete as jest.Mock).mockRejectedValue(mockError);
    
    // Call the function
    const result = await archiveFeatureFlag(mockProjectId, mockFeatureName);
    
    // Verify result is false
    expect(result).toBe(false);
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error archiving feature ${mockFeatureName} from project ${mockProjectId}`),
      expect.anything()
    );
    
    // Verify info logging for not found
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`Feature ${mockFeatureName} not found in project ${mockProjectId}`)
    );
  });
  
  test('archiveFeatureFlag should throw error for non-404 responses', async () => {
    // Mock error response
    const mockError = {
      response: {
        status: 500,
        data: { message: 'Internal server error' }
      }
    };
    (client.delete as jest.Mock).mockRejectedValue(mockError);
    
    // Call the function and expect it to throw
    await expect(
      archiveFeatureFlag(mockProjectId, mockFeatureName)
    ).rejects.toThrow();
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error archiving feature ${mockFeatureName} from project ${mockProjectId}`),
      expect.anything()
    );
  });
}); 