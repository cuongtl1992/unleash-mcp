import { handleDisableFlag } from '../../src/tools/disable-flag.js';
import { disableFeatureFlag } from '../../src/unleash/disable-feature-flag.js';
import { logger } from '../../src/logger.js';

// Mock dependencies
jest.mock('../../src/unleash/disable-feature-flag.js', () => ({
  disableFeatureFlag: jest.fn()
}));

jest.mock('../../src/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('Disable Flag Tool', () => {
  const mockParams = {
    projectId: 'test-project',
    featureName: 'test-feature',
    environment: 'development'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('handleDisableFlag should return success response when API succeeds', async () => {
    // Mock successful API call
    const mockApiResponse = { success: true };
    (disableFeatureFlag as jest.Mock).mockResolvedValue(mockApiResponse);
    
    // Call the handler
    const response = await handleDisableFlag(mockParams);
    
    // Verify API was called with correct parameters
    expect(disableFeatureFlag).toHaveBeenCalledWith(
      mockParams.projectId,
      mockParams.featureName,
      mockParams.environment
    );
    
    // Verify response structure
    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.message).toContain('Successfully disabled');
    expect(jsonResponse.data).toEqual(mockApiResponse);
  });
  
  test('handleDisableFlag should return error response when API fails', async () => {
    // Mock API error with response data
    const errorResponse = {
      response: {
        status: 404,
        data: {
          message: 'Feature flag not found'
        }
      },
      message: 'Request failed'
    };
    (disableFeatureFlag as jest.Mock).mockRejectedValue(errorResponse);
    
    // Call the handler
    const response = await handleDisableFlag(mockParams);
    
    // Verify error response structure
    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    expect(response.isError).toBe(true);
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toContain('Failed to disable feature flag');
    expect(jsonResponse.status).toBe(404);
  });
  
  test('handleDisableFlag should handle generic errors', async () => {
    // Mock a generic error without response data
    const genericError = new Error('Network error');
    (disableFeatureFlag as jest.Mock).mockRejectedValue(genericError);
    
    // Call the handler
    const response = await handleDisableFlag(mockParams);
    
    // Verify error response
    expect(response.isError).toBe(true);
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toContain('Network error');
    expect(jsonResponse.status).toBe(500);
  });
}); 