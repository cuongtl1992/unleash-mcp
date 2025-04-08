import { client } from "./unleash-client.js";

/**
 * Get all projects from the Unleash repository
 * @returns Array of projects or null if not available
 */
export async function getAllProjects(): Promise<any[] | null> {
  try {
    const response = await client.get('/api/admin/projects');
    return response.data.projects || response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return null;
  }
}
