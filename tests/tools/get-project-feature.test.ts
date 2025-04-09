import { handleGetProjectFeature } from '../../src/tools/get-project-feature.js';
import { getProjectFeature } from '../../src/unleash/get-project-feature.js';
import { logger } from '../../src/logger.js';

// Mock dependencies
jest.mock('../../src/unleash/get-project-feature.js', () => ({
  getProjectFeature: jest.fn()
}));

jest.mock('../../src/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('Get Project Feature Tool', () => {
  const mockParams = {
    projectId: 'test-project',
    featureName: 'test-feature'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('handleGetProjectFeature should return feature data when API succeeds', async () => {
    // Mock successful API response
    const mockFeature = {
      name: 'test-feature',
      enabled: true,
      description: 'A test feature',
      strategies: [],
      variants: []
    };
    (getProjectFeature as jest.Mock).mockResolvedValue(mockFeature);
    
    // Call the handler
    const response = await handleGetProjectFeature(mockParams);
    
    // Verify API was called with correct parameters
    expect(getProjectFeature).toHaveBeenCalledWith(
      mockParams.projectId,
      mockParams.featureName
    );
    
    // Verify response structure
    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.feature).toEqual(mockFeature);
    expect(jsonResponse.summary).toContain('retrieved successfully');
    expect(jsonResponse.summary).toContain('enabled');
  });
  
  test('handleGetProjectFeature should return error when feature not found', async () => {
    // Mock API returning null (feature not found)
    (getProjectFeature as jest.Mock).mockResolvedValue(null);
    
    // Call the handler
    const response = await handleGetProjectFeature(mockParams);
    
    // Verify error response
    expect(response.isError).toBe(true);
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.error).toContain('not found');
    expect(jsonResponse.projectId).toBe(mockParams.projectId);
    expect(jsonResponse.featureName).toBe(mockParams.featureName);
  });
  
  test('handleGetProjectFeature should handle API errors', async () => {
    // Mock API error
    const mockError = new Error('API connection failed');
    (getProjectFeature as jest.Mock).mockRejectedValue(mockError);
    
    // Call the handler
    const response = await handleGetProjectFeature(mockParams);
    
    // Verify error response
    expect(response.isError).toBe(true);
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.error).toBe('API connection failed');
    expect(jsonResponse.projectId).toBe(mockParams.projectId);
    expect(jsonResponse.featureName).toBe(mockParams.featureName);
  });
  
  test('handleGetProjectFeature should handle disabled features correctly', async () => {
    // Mock API returning disabled feature
    const mockFeature = {
      name: 'test-feature',
      enabled: false,
      description: 'A test feature',
      strategies: []
    };
    (getProjectFeature as jest.Mock).mockResolvedValue(mockFeature);
    
    // Call the handler
    const response = await handleGetProjectFeature(mockParams);
    
    // Verify success response
    expect(response.isError).toBeFalsy();
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.feature).toEqual(mockFeature);
    expect(jsonResponse.summary).toContain('disabled');
  });
});