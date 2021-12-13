import Joi from 'joi';
import j2s from 'joi-to-swagger';

import schemas from './index';

const swDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for Server',
    version: '1.0.0',
    description: 'The REST API for service',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  definitions: {},
};

export default swDocument;
