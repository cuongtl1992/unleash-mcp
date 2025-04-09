import { handleArchiveFlag } from '../../src/tools/archive-flag.js';
import { archiveFeatureFlag } from '../../src/unleash/archive-feature-flag.js';
import { logger } from '../../src/logger.js';

// Mock dependencies
jest.mock('../../src/unleash/archive-feature-flag.js', () => ({
  archiveFeatureFlag: jest.fn()
}));

jest.mock('../../src/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('Archive Flag Tool', () => {
  const mockParams = {
    projectId: 'test-project',
    featureName: 'test-feature'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('handleArchiveFlag should return success response when API succeeds', async () => {
    // Mock successful API call
    (archiveFeatureFlag as jest.Mock).mockResolvedValue(true);
    
    // Call the handler
    const response = await handleArchiveFlag(mockParams);
    
    // Verify API was called with correct parameters
    expect(archiveFeatureFlag).toHaveBeenCalledWith(
      mockParams.projectId,
      mockParams.featureName
    );
    
    // Verify response structure
    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.message).toContain('has been archived successfully');
    expect(jsonResponse.projectId).toBe(mockParams.projectId);
    expect(jsonResponse.featureName).toBe(mockParams.featureName);
  });
  
  test('handleArchiveFlag should return error when feature not found', async () => {
    // Mock API returning false (feature not found)
    (archiveFeatureFlag as jest.Mock).mockResolvedValue(false);
    
    // Call the handler
    const response = await handleArchiveFlag(mockParams);
    
    // Verify error response
    expect(response.isError).toBe(true);
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.error).toContain('not found');
    expect(jsonResponse.projectId).toBe(mockParams.projectId);
    expect(jsonResponse.featureName).toBe(mockParams.featureName);
  });
  
  test('handleArchiveFlag should handle API errors', async () => {
    // Mock API error
    const mockError = new Error('API connection failed');
    (archiveFeatureFlag as jest.Mock).mockRejectedValue(mockError);
    
    // Call the handler
    const response = await handleArchiveFlag(mockParams);
    
    // Verify error response
    expect(response.isError).toBe(true);
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.error).toBe('API connection failed');
    expect(jsonResponse.projectId).toBe(mockParams.projectId);
    expect(jsonResponse.featureName).toBe(mockParams.featureName);
  });
}); 