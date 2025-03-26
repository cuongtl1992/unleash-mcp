/**
 * Unleash client utility functions
 */

import { initialize, Unleash } from 'unleash-client';
import { Config } from '../config.js';

// Global client instance
let unleashClient: Unleash | null = null;

/**
 * Initialize the Unleash client
 * @param config Configuration options
 * @returns Promise that resolves to the initialized Unleash client
 */
export function initializeUnleashClient(config: Config): Promise<Unleash> {
  if (unleashClient) {
    return Promise.resolve(unleashClient);
  }

  return new Promise((resolve, reject) => {
    try {
      // Initialize the client with configuration options
      unleashClient = initialize({
        url: config.unleashUrl,
        appName: config.appName,
        instanceId: config.instanceId,
        refreshInterval: config.refreshInterval,
        metricsInterval: config.metricsInterval,
        customHeaders: { 
          Authorization: config.unleashToken 
        },
      });

      // Setup event handlers
      unleashClient.on('ready', () => {
        console.log('Unleash client initialized and ready');
        resolve(unleashClient!);
      });

      unleashClient.on('error', (error) => {
        console.error('Unleash client error:', error);
        // Don't reject as this might be a transient error
      });

      unleashClient.on('warn', (warning) => {
        console.warn('Unleash client warning:', warning);
      });

      // Set a timeout for initialization
      setTimeout(() => {
        if (unleashClient && (unleashClient as any).repository) {
          resolve(unleashClient);
        } else {
          reject(new Error('Unleash client initialization timed out'));
        }
      }, 10000);
    } catch (error) {
      console.error('Failed to initialize Unleash client:', error);
      reject(error);
    }
  });
}

/**
 * Get the initialized Unleash client instance
 * @returns The Unleash client instance
 * @throws Error if client is not initialized
 */
export function getUnleashClient(): Unleash {
  if (!unleashClient) {
    throw new Error('Unleash client not initialized');
  }
  return unleashClient;
}

/**
 * Clean up Unleash client resources
 */
export function destroyUnleashClient(): void {
  if (unleashClient) {
    unleashClient.destroy();
    unleashClient = null;
    console.log('Unleash client destroyed');
  }
}

/**
 * Check if the Unleash client is ready
 * @returns boolean indicating if the client is ready
 */
export function isUnleashClientReady(): boolean {
  return !!unleashClient && !!(unleashClient as any).repository;
}

/**
 * Get feature flag metrics from the Unleash client
 * @returns Metrics data or null if not available
 */
export function getUnleashMetrics(): any {
  if (!unleashClient || !(unleashClient as any).metrics) {
    return null;
  }
  
  return (unleashClient as any).metrics.getMetrics();
}

/**
 * Get all feature flags from the Unleash repository
 * @returns Array of feature flags or null if not available
 */
export function getAllFeatureFlags(): any[] | null {
  if (!unleashClient || !(unleashClient as any).repository) {
    return null;
  }
  
  return (unleashClient as any).repository.getToggles();
}

/**
 * Get a specific feature flag from the Unleash repository
 * @param flagName Name of the feature flag
 * @returns Feature flag data or null if not found/available
 */
export function getFeatureFlag(flagName: string): any | null {
  if (!unleashClient || !(unleashClient as any).repository) {
    return null;
  }
  
  return (unleashClient as any).repository.getToggle(flagName);
}
