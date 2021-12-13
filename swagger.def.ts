const swDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Development server API',
    version: '1.0.0',
    description: 'The REST API Development service',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  paths: {},
};

export default swDocument;
