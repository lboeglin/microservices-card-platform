"use strict"
import express from 'express'
import cardController from '../controller/CardController.mjs'

const router = express.Router()

router
    .route('/get-cards/:amount')
    .get(async (request, response) => {
        /*
        #swagger.summary = "Returns a given amount of random cards."
        #swagger.description = "The cards are either generated on the fly then persisted into the
        database, or fetched from the already stored cards. The amount of generated cards is
        random but capped by the maximal amount of cards configuration value, as well as
        adjusted if there are not enough cards in the database to fulfill the request."
         */
        try {
            const amount = Number(request.params.amount)
            const cards = await cardController.getRandomCards(amount)
            const result = cards.map((value) => {
                return value
            })
            response.status(200).send(result)
        } catch (e) {
            response.status(500).send("Error - " + e)
        }
    })

router
    .route('/get-existing-cards')
    .get(async (request, response) => {
        /*
        #swagger.summary = "Returns an array of all the cards that have already been generated."
        */
        response.status(200).send(await cardController.getAll())
    })

router
    .route('/get-card-info/:id')
    .get(async (request, response) => {
        /*
        #swagger.summary = "Returns a card object from the specified ID."
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'The ID of the desired card.',
            required: true,
            type: 'integer'
        }
         */
        try {
            const id = Number(request.params.id) 

            response.status(200).send(await cardController.getFromId(id))
        } catch (e) {
            response.status(500).send("Error - " + e)
        }
    })

router
    .route('/get-collection-info')
    .post(async (request, response) => {
        /*
        #swagger.summary = "Returns an array with the corresponding cards."
        #swagger.description = "It is the same as `/get-card-info/{id}` but with an array of IDs."
        #swagger.parameters['IDs'] = {
            in: 'body',
            description: 'An array of card ids',
            required: true,
            schema: [1, 2, 3]
        }
        */
        try {
            const ids = request.body
		const cards = await Promise.all(ids.map(async (id) => { return await cardController.getFromId(id) }))
		console.log(cards)
            response.status(200).send(
		cards
            )
        } catch (e) {
            response.status(500).send("Error - " + e)
        }
    })

export default router
