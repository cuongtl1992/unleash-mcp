import { handleUpdateStrategy } from '../../src/tools/update-strategy.js';
import { updateFeatureStrategy } from '../../src/unleash/update-feature-strategy.js';
import { logger } from '../../src/logger.js';

// Mock dependencies
jest.mock('../../src/unleash/update-feature-strategy.js', () => ({
  updateFeatureStrategy: jest.fn()
}));

jest.mock('../../src/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('Update Strategy Tool', () => {
  const mockParams = {
    projectId: 'test-project',
    featureName: 'test-feature',
    environment: 'development',
    strategyId: 'strategy-123',
    name: 'default',
    parameters: {
      groupId: 'test-group'
    },
    constraints: [
      {
        contextName: 'userId',
        operator: 'IN',
        values: ['123', '456']
      }
    ]
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('handleUpdateStrategy should return success response when API succeeds', async () => {
    // Mock successful API call
    const mockStrategy = {
      id: 'strategy-123',
      name: 'default',
      parameters: { groupId: 'test-group' },
      constraints: mockParams.constraints
    };
    (updateFeatureStrategy as jest.Mock).mockResolvedValue({
      success: true,
      data: mockStrategy
    });
    
    // Call the handler
    const response = await handleUpdateStrategy(mockParams);
    
    // Verify API was called with correct parameters
    expect(updateFeatureStrategy).toHaveBeenCalledWith(mockParams);
    
    // Verify response structure
    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    expect(response.isError).toBeFalsy();
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.message).toContain('Successfully updated strategy');
    expect(jsonResponse.strategy).toEqual(mockStrategy);
  });
  
  test('handleUpdateStrategy should return error response when API fails', async () => {
    // Mock API error with specific status code and message
    (updateFeatureStrategy as jest.Mock).mockResolvedValue({
      success: false,
      error: {
        code: 404,
        message: 'Strategy not found'
      }
    });
    
    // Call the handler
    const response = await handleUpdateStrategy(mockParams);
    
    // Verify error response
    expect(response.isError).toBe(true);
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.statusCode).toBe(404);
    expect(jsonResponse.error).toBe('Strategy not found');
  });
  
  test('handleUpdateStrategy should handle validation errors', async () => {
    // Mock API validation error
    (updateFeatureStrategy as jest.Mock).mockResolvedValue({
      success: false,
      error: {
        code: 400,
        message: 'Invalid strategy configuration'
      }
    });
    
    // Call the handler
    const response = await handleUpdateStrategy(mockParams);
    
    // Verify error response
    expect(response.isError).toBe(true);
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.statusCode).toBe(400);
    expect(jsonResponse.error).toBe('Invalid strategy configuration');
  });
  
  test('handleUpdateStrategy should handle unexpected exceptions', async () => {
    // Mock unexpected exception
    const mockError = new Error('Network failure');
    (updateFeatureStrategy as jest.Mock).mockRejectedValue(mockError);
    
    // Call the handler
    const response = await handleUpdateStrategy(mockParams);
    
    // Verify error response
    expect(response.isError).toBe(true);
    
    // Parse the JSON response
    const jsonResponse = JSON.parse(response.content[0].text);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.error).toBe('Network failure');
  });
});