'use strict'

import express from 'express'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerJson from './swagger.json' with {type: 'json'}

dotenv.config()

const APIPATH = process.env.API_PATH || '/api/v0'

const app = express()

app.use((req , res, next) => {
    res .setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methodds', 'OPTIONS,  GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use(express.json())

app.use('/api/v0/doc', swaggerUi.serve, swaggerUi.setup(swaggerJson))

const {default: routes} = await import ('./api/routes/routes.mjs')
app.use(APIPATH+'/', routes)

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.status || 500
    const message = error.message || 'Internal Server Error'
    res.status(status).json({message: message})
})

export default app