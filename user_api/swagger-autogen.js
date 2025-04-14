import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv'
dotenv.config()

const serverPort = process.env.PORT
const serverHost = process.env.HOST
const APIPATH = process.env.API_PATH

const outputFile = './swagger.json';
const endpointsFiles = ['./src/route/routes.mjs'];

const config = {
	info: {
		title: 'User API Documentation',
		description: '',
	},
	tags: [],
	host: '172.21.44.109:' + serverPort + APIPATH,
	schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);
