import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv'
dotenv.config()

const serverPort = process.env.PORT
const serverHost = process.env.HOST
const APIPATH = process.env.API_PATH

const outputFile = './swagger.json';
const endpointsFiles = ['./src/route/*.mjs'];

const config = {
	info: {
		title: 'Cards API Documentation',
		description: 'The API that gives you cards.',
	},
	tags: ['Cards'],
	host: serverHost + ':' + serverPort + APIPATH,
	schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, config);
