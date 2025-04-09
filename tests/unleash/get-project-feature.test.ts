import { getProjectFeature } from '../../src/unleash/get-project-feature.js';
import { client } from '../../src/unleash/unleash-client.js';
import { logger } from '../../src/logger.js';

// Mock dependencies
jest.mock('../../src/unleash/unleash-client.js', () => ({
  client: {
    get: jest.fn()
  }
}));

jest.mock('../../src/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('Get Project Feature API', () => {
  const mockProjectId = 'test-project';
  const mockFeatureName = 'test-feature';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('getProjectFeature should call the correct API endpoint', async () => {
    // Mock successful response
    const mockResponse = { 
      data: { 
        name: 'test-feature',
        enabled: true,
        strategies: []
      } 
    };
    (client.get as jest.Mock).mockResolvedValue(mockResponse);
    
    // Call the function
    const result = await getProjectFeature(mockProjectId, mockFeatureName);
    
    // Verify API call
    expect(client.get).toHaveBeenCalledWith(
      `/api/admin/projects/${mockProjectId}/features/${mockFeatureName}`
    );
    
    // Verify result
    expect(result).toEqual(mockResponse.data);
    
    // Verify logging
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`Successfully fetched feature ${mockFeatureName} from project ${mockProjectId}`)
    );
  });
  
  test('getProjectFeature should return null when feature not found', async () => {
    // Mock 404 error response
    const mockError = {
      response: {
        status: 404
      }
    };
    (client.get as jest.Mock).mockRejectedValue(mockError);
    
    // Call the function
    const result = await getProjectFeature(mockProjectId, mockFeatureName);
    
    // Verify result is null
    expect(result).toBeNull();
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error fetching feature ${mockFeatureName} from project ${mockProjectId}`),
      expect.anything()
    );
    
    // Verify info logging for not found
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`Feature ${mockFeatureName} not found in project ${mockProjectId}`)
    );
  });
  
  test('getProjectFeature should throw error for non-404 responses', async () => {
    // Mock error response
    const mockError = {
      response: {
        status: 500,
        data: { message: 'Internal server error' }
      }
    };
    (client.get as jest.Mock).mockRejectedValue(mockError);
    
    // Call the function and expect it to throw
    await expect(
      getProjectFeature(mockProjectId, mockFeatureName)
    ).rejects.toThrow();
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error fetching feature ${mockFeatureName} from project ${mockProjectId}`),
      expect.anything()
    );
  });
}); 