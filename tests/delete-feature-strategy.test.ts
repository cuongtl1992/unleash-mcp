import { deleteFeatureStrategy } from '../src/unleash/delete-feature-strategy.js';
import { client } from '../src/unleash/unleash-client.js';
import { logger } from '../src/logger.js';

// Mock dependencies
jest.mock('../src/unleash/unleash-client.js', () => ({
  client: {
    delete: jest.fn()
  }
}));

jest.mock('../src/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('deleteFeatureStrategy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should delete strategy successfully', async () => {
    // Mock successful API response
    (client.delete as jest.Mock).mockResolvedValue({});

    // Call the function
    const result = await deleteFeatureStrategy('default', 'test-flag', 'development', 'strategy-123');

    // Verify API call
    expect(client.delete).toHaveBeenCalledWith(
      '/api/admin/projects/default/features/test-flag/environments/development/strategies/strategy-123'
    );

    // Verify result
    expect(result).toBe(true);
    expect(logger.info).toHaveBeenCalled();
  });

  test('should handle errors', async () => {
    // Mock API error
    const error = new Error('API Error');
    (client.delete as jest.Mock).mockRejectedValue(error);

    // Call the function
    const result = await deleteFeatureStrategy('default', 'test-flag', 'development', 'strategy-123');

    // Verify API call
    expect(client.delete).toHaveBeenCalled();

    // Verify error handling
    expect(result).toBe(false);
    expect(logger.error).toHaveBeenCalled();
  });
}); 