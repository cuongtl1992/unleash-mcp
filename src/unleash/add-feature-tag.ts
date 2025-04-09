import { client } from './unleash-client.js';
import { logger } from '../logger.js';

/**
 * Add a tag to a feature
 * @param featureName Name of the feature to add the tag to
 * @param tagType Type of the tag
 * @param tagValue Value of the tag
 * @returns True if tag was added successfully, false otherwise
 */
export async function addFeatureTag(
  featureName: string, 
  tagType: string, 
  tagValue: string
): Promise<boolean> {
  try {
    const payload = {
      type: tagType,
      value: tagValue
    };
    
    await client.post(`/api/admin/features/${featureName}/tags`, payload);
    logger.info(`Successfully added tag "${tagType}:${tagValue}" to feature "${featureName}"`);
    return true;
  } catch (error) {
    logger.error(`Error adding tag to feature ${featureName}:`, error);
    return false;
  }
} 