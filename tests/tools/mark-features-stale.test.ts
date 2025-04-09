import { handleMarkFeaturesStale } from '../../src/tools/mark-features-stale.js';
import { markFeaturesStale } from '../../src/unleash/mark-features-stale.js';
import { logger } from '../../src/logger.js';

// Mock dependencies
jest.mock('../../src/unleash/mark-features-stale.js', () => ({
  markFeaturesStale: jest.fn()
}));

jest.mock('../../src/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('Mark Features Stale Tool', () => {
  const mockParamsStale = {
    projectId: 'test-project',
    features: ['feature-1', 'feature-2', 'feature-3'],
    stale: true
  };
  
  const mockParamsNotStale = {
    projectId: 'test-project',
    features: ['feature-1', 'feature-2', 'feature-3'],
    stale: false
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('handleMarkFeaturesStale should return success response when marking as stale', async () => {
    // Mock successful API call
    const mockApiResponse = { success: true };
    (markFeaturesStale as jest.Mock).mockResolvedValue(mockApiResponse);
    
    // Call the handler
    const response = await handleMarkFeaturesStale(mockParamsStale);
    
    // Verify API was called with correct parameters
    expect(markFeaturesStale).toHaveBeenCalledWith(
      mockParamsStale.projectId,
      mockParamsStale.features,
      mockParamsStale.stale
    );
    
    // Verify response structure
    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.message).toContain('Successfully marked');
    expect(jsonResponse.message).toContain('as stale');
    expect(jsonResponse.data.features).toEqual(mockParamsStale.features);
  });
  
  test('handleMarkFeaturesStale should return success response when marking as not stale', async () => {
    // Mock successful API call
    const mockApiResponse = { success: true };
    (markFeaturesStale as jest.Mock).mockResolvedValue(mockApiResponse);
    
    // Call the handler
    const response = await handleMarkFeaturesStale(mockParamsNotStale);
    
    // Verify API was called with correct parameters
    expect(markFeaturesStale).toHaveBeenCalledWith(
      mockParamsNotStale.projectId,
      mockParamsNotStale.features,
      mockParamsNotStale.stale
    );
    
    // Verify response structure
    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.message).toContain('Successfully marked');
    expect(jsonResponse.message).toContain('as not stale');
    expect(jsonResponse.data.features).toEqual(mockParamsNotStale.features);
  });
  
  test('handleMarkFeaturesStale should return error response when API fails', async () => {
    // Mock API error with response data
    const errorResponse = {
      response: {
        status: 403,
        data: {
          message: 'Forbidden: Insufficient permissions'
        }
      },
      message: 'Request failed'
    };
    (markFeaturesStale as jest.Mock).mockRejectedValue(errorResponse);
    
    // Call the handler
    const response = await handleMarkFeaturesStale(mockParamsStale);
    
    // Verify error response structure
    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    expect(response.isError).toBe(true);
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toContain('Failed to mark features as stale');
    expect(jsonResponse.status).toBe(403);
  });
  
  test('handleMarkFeaturesStale should handle generic errors', async () => {
    // Mock a generic error without response data
    const genericError = new Error('Network error');
    (markFeaturesStale as jest.Mock).mockRejectedValue(genericError);
    
    // Call the handler
    const response = await handleMarkFeaturesStale(mockParamsStale);
    
    // Verify error response
    expect(response.isError).toBe(true);
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toContain('Network error');
    expect(jsonResponse.status).toBe(500);
  });
}); 