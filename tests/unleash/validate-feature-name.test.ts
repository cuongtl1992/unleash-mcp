import { validateFeatureName } from '../../src/unleash/validate-feature-name.js';
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

describe('Validate Feature Name API', () => {
  const mockFeatureName = 'test-feature';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('validateFeatureName should return isValid:true for valid name', async () => {
    // Mock successful response (200 OK)
    const mockResponse = { 
      status: 200
    };
    (client.post as jest.Mock).mockResolvedValue(mockResponse);
    
    // Call the function
    const result = await validateFeatureName(mockFeatureName);
    
    // Verify API call with correct payload
    expect(client.post).toHaveBeenCalledWith(
      '/api/admin/features/validate',
      { name: mockFeatureName }
    );
    
    // Verify result
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
    
    // Verify logging
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`Feature name '${mockFeatureName}' is valid`)
    );
  });
  
  test('validateFeatureName should return appropriate error for 400 response', async () => {
    // Mock 400 error response (not URL friendly)
    const mockError = {
      response: {
        status: 400
      }
    };
    (client.post as jest.Mock).mockRejectedValue(mockError);
    
    // Call the function
    const result = await validateFeatureName(mockFeatureName);
    
    // Verify result
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Feature name is not URL friendly');
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error validating feature name '${mockFeatureName}'`),
      expect.anything()
    );
  });
  
  test('validateFeatureName should return appropriate error for 409 response', async () => {
    // Mock 409 error response (name exists)
    const mockError = {
      response: {
        status: 409
      }
    };
    (client.post as jest.Mock).mockRejectedValue(mockError);
    
    // Call the function
    const result = await validateFeatureName(mockFeatureName);
    
    // Verify result
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Feature name already exists');
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error validating feature name '${mockFeatureName}'`),
      expect.anything()
    );
  });
  
  test('validateFeatureName should return appropriate error for 415 response', async () => {
    // Mock 415 error response (unsupported media type)
    const mockError = {
      response: {
        status: 415
      }
    };
    (client.post as jest.Mock).mockRejectedValue(mockError);
    
    // Call the function
    const result = await validateFeatureName(mockFeatureName);
    
    // Verify result
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Unsupported media type');
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error validating feature name '${mockFeatureName}'`),
      expect.anything()
    );
  });
  
  test('validateFeatureName should handle unexpected errors', async () => {
    // Mock other error response
    const mockError = {
      message: 'Network error'
    };
    (client.post as jest.Mock).mockRejectedValue(mockError);
    
    // Call the function
    const result = await validateFeatureName(mockFeatureName);
    
    // Verify result
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('An unknown error occurred during validation');
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error validating feature name '${mockFeatureName}'`),
      expect.anything()
    );
  });
}); 