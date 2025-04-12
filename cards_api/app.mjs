"use strict"
import express from "express";
import swaggerUi from 'swagger-ui-express'
import swaggerJson from './swagger.json' with {type: 'json'};

//pour lire le .env
import dotenv from 'dotenv'
dotenv.config()

const app = express()

const API_PATH = process.env.API_PATH

//chargement des middleware
//Pour le CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Methods", 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type,Authorization');
    next();
})

//pour traiter les body en json
app.use(express.json())

//route pour swagger
app.use(API_PATH + '/doc', swaggerUi.serve, swaggerUi.setup(swaggerJson))

//chargement des routes
const { default: routes } = await import('./src/route/route.mjs')

app.use(API_PATH, routes)

//message par defaut
app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).json({ message: message })
})

export default app;
