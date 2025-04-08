import { getAllProjects } from '../unleash/get-all-projects.js';

async function handleProjectsList(uri: URL) {
  try {
    const projects = await getAllProjects();

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(projects, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify({ error: error.message }),
        },
      ],
    };
  }
}

export const projectResources = [
  {
    name: 'projects-list',
    template: 'unleash://projects',
    handler: handleProjectsList,
  },
];