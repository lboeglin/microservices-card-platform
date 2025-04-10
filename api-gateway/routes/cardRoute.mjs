'use strict'

import express from 'express'
import cardController from '../controller/cardController.mjs'

const cardRouter = express.Router()

cardRouter
    .route('/card-info/:id')
        .get(async (req, res) => {
            try {
                const id = req.params.id
                const card = await cardController.getCard(id)
                res.status(200).json(card)
            } catch (error) {
                console.error('Error fetching card:', error)
                res.status(500).json({ error: 'Internal Server Error' })
            }
        }
    )
    .route('/get-cards/:number')
        .get(async (req, res) => {
            try {
                const number = req.params.number
                const cards = await cardController.getCards(number)
                res.status(200).json(cards)
            } catch (error) {
                console.error('Error fetching cards:', error)
                res.status(500).json({ error: 'Internal Server Error' })
            }
        }
    )
    .route('/collection-info')
        .post(async (req, res) => {
            try {
                const collectionIds = req.body.collection
                const collection = await cardController.getCollection(collectionIds)
                res.status(200).json(collection)
            } catch (error) {
                console.error('Error fetching collection:', error)
                res.status(500).json({ error: 'Internal Server Error' })
            }
        }
    )

export default cardRouter