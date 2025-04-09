import { getProjectFeatures } from '../src/unleash/get-project-features.js';
import { client } from '../src/unleash/unleash-client.js';
import { logger } from '../src/logger.js';

// Mock dependencies
jest.mock('../src/unleash/unleash-client.js', () => ({
  client: {
    get: jest.fn()
  }
}));

jest.mock('../src/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('getProjectFeatures', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch project features successfully', async () => {
    // Sample feature data
    const mockFeatures = [
      { name: 'feature-1', enabled: true },
      { name: 'feature-2', enabled: false }
    ];
    
    // Mock successful API response
    (client.get as jest.Mock).mockResolvedValue({
      data: {
        features: mockFeatures
      }
    });

    // Call the function
    const result = await getProjectFeatures('default');

    // Verify API call
    expect(client.get).toHaveBeenCalledWith(
      '/api/admin/projects/default/features'
    );

    // Verify result
    expect(result).toEqual(mockFeatures);
    expect(logger.info).toHaveBeenCalled();
  });

  test('should handle response format without features property', async () => {
    // Sample direct data format
    const mockData = [
      { name: 'feature-1', enabled: true },
      { name: 'feature-2', enabled: false }
    ];
    
    // Mock successful API response with direct data format
    (client.get as jest.Mock).mockResolvedValue({
      data: mockData
    });

    // Call the function
    const result = await getProjectFeatures('default');

    // Verify result
    expect(result).toEqual(mockData);
  });

  test('should handle errors', async () => {
    // Mock API error
    const error = new Error('API Error');
    (client.get as jest.Mock).mockRejectedValue(error);

    // Call the function
    const result = await getProjectFeatures('default');

    // Verify API call
    expect(client.get).toHaveBeenCalled();

    // Verify error handling
    expect(result).toBe(null);
    expect(logger.error).toHaveBeenCalled();
  });
}); 