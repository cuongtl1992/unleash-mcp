import { config } from '../config.js';

import axios from 'axios';

const client = axios.create({
  baseURL: config.unleashUrl,
  headers: {
    Authorization: `${config.apiToken}`,
  },
});

export { client };

