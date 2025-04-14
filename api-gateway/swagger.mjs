import swaggerAutogen from 'swagger-autogen';

const config = {
  info: {
    title: 'API Gateway',
    description: 'API Gateway Documentation',
  },
  tags :[ ],
  host: 'localhost:8080/api/v0',
  shemes: ['https', 'https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./api/routes/routes.mjs'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, endpointsFiles, config);