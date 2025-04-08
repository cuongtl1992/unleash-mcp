import { getAllProjects } from '../unleash/get-all-projects.js';

async function handleGetProjects() {
  try {
    const projects = await getAllProjects();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(projects, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: false,
              error: error.message,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

export const getProjects = {
  name: 'getProjects',
  description: 'Get a list of all projects',
  handler: handleGetProjects,
};
