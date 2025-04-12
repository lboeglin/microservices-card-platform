"use strict"
import express from 'express'
import cardController from '../controller/CardController.mjs'

const router = express.Router()

router
    .route('/')
    .get((req, res) => {
        res.status(200).send('THE CARD API IS ONLINE')
    })

router
    .route('/get-cards')
    .get(async (request, response) => {
        try {
            const amount = Number(request.query.amount)
            const cards = await cardController.getRandom(amount)
            const result = cards.map((value) => {
                return value
            })
            response.status(200).send(result)
        } catch (e) {
            response.status(400).send("Bad Request - " + e)
        }
    })

router
    .route('/get-existing-cards')
    .get(async (request, response) => {
        response.status(200).send(await cardController.getAll())
    })

export default router
