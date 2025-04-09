import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv'
dotenv.config()

const serverPort = process.env.PORT
const APIPATH = process.env.API_PATH

const outputFile = './swagger.json';
const endpointsFiles = ['./api/route/*.mjs'];

const config = {
    info: {
        title: 'User API Documentation',
        description: '',
    },
    tags: [ ],
    host: 'localhost:'+serverPort+APIPATH,
    schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);
