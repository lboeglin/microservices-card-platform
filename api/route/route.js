"use strict"
import express from 'express'
import cardController from "../controller/cardController";

const router = express.Router()

router
    .route('/cards')
    .get(async (req, res) =>{
        const data = await cardController.findAll()
        res.status(200).send(data)
    })

router
    .route('/card/:id')
    .get(async (req, res) =>{
        const id = parseFloat(req.params.id)
        const data = await cardController.findFromId(id)
        res.status(200).send(data)
    })

export default router
