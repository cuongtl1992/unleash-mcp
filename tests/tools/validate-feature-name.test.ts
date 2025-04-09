import { handleValidateFeatureName } from '../../src/tools/validate-feature-name.js';
import { validateFeatureName } from '../../src/unleash/validate-feature-name.js';
import { logger } from '../../src/logger.js';

// Mock dependencies
jest.mock('../../src/unleash/validate-feature-name.js', () => ({
  validateFeatureName: jest.fn()
}));

jest.mock('../../src/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('Validate Feature Name Tool', () => {
  const mockParams = {
    featureName: 'test-feature'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('handleValidateFeatureName should return success for valid name', async () => {
    // Mock valid name response
    (validateFeatureName as jest.Mock).mockResolvedValue({ 
      isValid: true 
    });
    
    // Call the handler
    const response = await handleValidateFeatureName(mockParams);
    
    // Verify API was called with correct parameters
    expect(validateFeatureName).toHaveBeenCalledWith(mockParams.featureName);
    
    // Verify response structure
    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    expect(response.isError).toBeFalsy();
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.valid).toBe(true);
    expect(jsonResponse.featureName).toBe(mockParams.featureName);
    expect(jsonResponse.message).toContain('valid and available');
  });
  
  test('handleValidateFeatureName should return invalid response for invalid name', async () => {
    // Mock invalid name response
    (validateFeatureName as jest.Mock).mockResolvedValue({ 
      isValid: false, 
      error: 'Feature name is not URL friendly' 
    });
    
    // Call the handler
    const response = await handleValidateFeatureName(mockParams);
    
    // Verify response structure - should not be a tool error
    expect(response.isError).toBeFalsy();
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.valid).toBe(false);
    expect(jsonResponse.featureName).toBe(mockParams.featureName);
    expect(jsonResponse.error).toBe('Feature name is not URL friendly');
  });
  
  test('handleValidateFeatureName should return error for name that already exists', async () => {
    // Mock name-exists response
    (validateFeatureName as jest.Mock).mockResolvedValue({ 
      isValid: false, 
      error: 'Feature name already exists' 
    });
    
    // Call the handler
    const response = await handleValidateFeatureName(mockParams);
    
    // Verify response structure
    expect(response.isError).toBeFalsy();
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.valid).toBe(false);
    expect(jsonResponse.featureName).toBe(mockParams.featureName);
    expect(jsonResponse.error).toBe('Feature name already exists');
  });
  
  test('handleValidateFeatureName should handle unexpected errors', async () => {
    // Mock API error
    const mockError = new Error('Unexpected API failure');
    (validateFeatureName as jest.Mock).mockRejectedValue(mockError);
    
    // Call the handler
    const response = await handleValidateFeatureName(mockParams);
    
    // Verify error response
    expect(response.isError).toBe(true);
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.featureName).toBe(mockParams.featureName);
    expect(jsonResponse.error).toBe('Unexpected API failure');
  });
}); 