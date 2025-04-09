import { updateFeatureStrategy, UpdateFeatureStrategyParams } from '../../src/unleash/update-feature-strategy.js';
import { client } from '../../src/unleash/unleash-client.js';
import { logger } from '../../src/logger.js';

// Mock dependencies
jest.mock('../../src/unleash/unleash-client.js', () => ({
  client: {
    put: jest.fn()
  }
}));

jest.mock('../../src/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('Update Feature Strategy API', () => {
  const mockParams: UpdateFeatureStrategyParams = {
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
  
  test('updateFeatureStrategy should call the correct API endpoint with payload', async () => {
    // Mock successful response
    const mockResponse = { 
      data: { 
        id: 'strategy-123',
        name: 'default',
        parameters: { groupId: 'test-group' },
        constraints: mockParams.constraints
      } 
    };
    (client.put as jest.Mock).mockResolvedValue(mockResponse);
    
    // Call the function
    const result = await updateFeatureStrategy(mockParams);
    
    // Verify API call with correct payload
    expect(client.put).toHaveBeenCalledWith(
      `/api/admin/projects/${mockParams.projectId}/features/${mockParams.featureName}/environments/${mockParams.environment}/strategies/${mockParams.strategyId}`,
      {
        name: mockParams.name,
        parameters: mockParams.parameters,
        constraints: mockParams.constraints
      }
    );
    
    // Verify result
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockResponse.data);
    
    // Verify logging
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`Updating strategy ${mockParams.strategyId} for feature: ${mockParams.featureName}`)
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`Successfully updated strategy for feature flag: ${mockParams.featureName}`)
    );
  });
  
  test('updateFeatureStrategy should handle 404 error correctly', async () => {
    // Mock 404 error response
    const mockError = {
      response: {
        status: 404,
        data: { message: 'Strategy not found' }
      }
    };
    (client.put as jest.Mock).mockRejectedValue(mockError);
    
    // Call the function
    const result = await updateFeatureStrategy(mockParams);
    
    // Verify result
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(404);
    expect(result.error?.message).toBe('Strategy not found');
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error updating strategy for feature flag ${mockParams.featureName}`),
      expect.objectContaining({
        statusCode: 404,
        message: 'Strategy not found'
      })
    );
  });
  
  test('updateFeatureStrategy should handle 400 error correctly', async () => {
    // Mock 400 error response
    const mockError = {
      response: {
        status: 400,
        data: { message: 'Invalid strategy configuration' }
      }
    };
    (client.put as jest.Mock).mockRejectedValue(mockError);
    
    // Call the function
    const result = await updateFeatureStrategy(mockParams);
    
    // Verify result
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(400);
    expect(result.error?.message).toBe('Invalid strategy configuration');
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error updating strategy for feature flag ${mockParams.featureName}`),
      expect.objectContaining({
        statusCode: 400
      })
    );
  });
  
  test('updateFeatureStrategy should handle generic errors correctly', async () => {
    // Mock generic error without response data
    const mockError = new Error('Network error');
    (client.put as jest.Mock).mockRejectedValue(mockError);
    
    // Call the function
    const result = await updateFeatureStrategy(mockParams);
    
    // Verify result
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(500);
    expect(result.error?.message).toBe('Network error');
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(`Error updating strategy for feature flag ${mockParams.featureName}`),
      expect.objectContaining({
        statusCode: undefined,
        message: 'Network error'
      })
    );
  });
}); 