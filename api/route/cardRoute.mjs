'use strict'

import express from 'express'
import cardController from "../controller/cardController.mjs";

const cardRoutes = express.Router()

cardRoutes
    .route('/getAll')
    .get(async (req, res) =>{
        const data = await cardController.getAll()
        res.status(200).send(data)
    })

cardRoutes
    .route('/:id')
    .get(async (req, res) =>{
        const id = parseFloat(req.params.id)
        const data = await cardController.getFromId(id)
        res.status(200).send(data)
    })

export default cardRoutes;