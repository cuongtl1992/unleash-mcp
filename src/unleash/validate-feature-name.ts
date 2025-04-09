import { logger } from '../logger.js';
import { client } from './unleash-client.js';

/**
 * Interface for validation result
 */
export interface FeatureNameValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate a feature flag name
 * @param featureName Name of the feature flag to validate
 * @returns Validation result
 */
export async function validateFeatureName(featureName: string): Promise<FeatureNameValidationResult> {
  try {
    await client.post('/api/admin/features/validate', { name: featureName });
    logger.info(`Feature name '${featureName}' is valid`);
    return { isValid: true };
  } catch (error: any) {
    logger.error(`Error validating feature name '${featureName}':`, error);
    
    let errorMessage = 'An unknown error occurred during validation';
    
    if (error.response) {
      const { status } = error.response;
      
      if (status === 400) {
        errorMessage = 'Feature name is not URL friendly';
      } else if (status === 409) {
        errorMessage = 'Feature name already exists';
      } else if (status === 415) {
        errorMessage = 'Unsupported media type';
      }
    }
    
    return { 
      isValid: false, 
      error: errorMessage 
    };
  }
} 