import { setStrategySortOrder } from '../src/unleash/set-strategy-sort-order.js';
import { client } from '../src/unleash/unleash-client.js';
import { logger } from '../src/logger.js';

// Mock dependencies
jest.mock('../src/unleash/unleash-client.js', () => ({
  client: {
    post: jest.fn()
  }
}));

jest.mock('../src/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('setStrategySortOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should set strategy sort order successfully', async () => {
    // Mock successful API response
    (client.post as jest.Mock).mockResolvedValue({});

    // Call the function
    const strategyIds = ['strategy-3', 'strategy-1', 'strategy-2'];
    const result = await setStrategySortOrder('default', 'test-flag', 'development', strategyIds);

    // Verify API call
    expect(client.post).toHaveBeenCalledWith(
      '/api/admin/projects/default/features/test-flag/environments/development/strategies/set-sort-order',
      strategyIds
    );

    // Verify result
    expect(result).toBe(true);
    expect(logger.info).toHaveBeenCalled();
  });

  test('should handle errors', async () => {
    // Mock API error
    const error = new Error('API Error');
    (client.post as jest.Mock).mockRejectedValue(error);

    // Call the function
    const strategyIds = ['strategy-3', 'strategy-1', 'strategy-2'];
    const result = await setStrategySortOrder('default', 'test-flag', 'development', strategyIds);

    // Verify API call
    expect(client.post).toHaveBeenCalled();

    // Verify error handling
    expect(result).toBe(false);
    expect(logger.error).toHaveBeenCalled();
  });
}); 