'use strict'

import mongoose from 'mongoose'
import { Int32 } from 'mongodb'
import Card from "../model/Card.mjs"

const projection = { _id: 0, __v: 0 }

const cardSchema = new mongoose.Schema({
    id: {
        type: Int32,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rarity: {
        type: Int32,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

const cardModel = mongoose.model('Card', cardSchema)

/**
 * Adapts a `mongoose.Document` to a model `Card`.
 * @param {mongoose.Document} mongooseCard 
 * @returns {Card?}
 */
const adapter = (mongooseCard) => {
    if (mongooseCard == null)
        return null
    mongooseCard = mongooseCard.toJSON()
    return new Card(mongooseCard)
}

const cardDao = {
    /**
     * Returns all the cards stored.
     * @returns {Promise<Card[]?>}
     */
    getAllCards: async () => {
        const cards = await cardModel.find({}, projection)
        return cards.map((value) => {
            return adapter(value)
        })
    },

    /**
     * Returns a card with the specified ID.
     * @param {number} id
     * @returns {Promise<Card?>}
     */
    getCard: async (id) => {
        const card = await cardModel.findOne({ id: id }, projection)
        return adapter(card)
    },

    /**
     * Persists a new card into the database.
     * @param {Card} card 
     * @returns {Promise<void>}
     */
    addCard: async (card) => {
        try {
            const addedCard = new cardModel(card)
            addedCard.save()
            Card.existingCards++
        }
        catch (e) {
            console.error(`The card ${card} cannot be persisted.`)
        }
    },

    updateCard: async (cardId, cardData) => {
        return await cardModel.findOneAndUpdate({ id: cardId }, cardData)
    },

    deleteCard: async (cardId) => {
        return await cardModel.deleteOne({ id: cardId })
    },

    /**
     * Gets a list of cards matching the specified filters.
     * @param {string?} cardType The type of cards to search for
     * @param {Number} cardRarityMin The minimum rarity. Must be between 0 and `cardRarityMax` included.
     * @param {Number} cardRarityMax The maximum rarity. Must be between `cardRarityMax` and 3 included.
     */
    getCardWithFilter: async (cardType, cardRarityMin, cardRarityMax) => {
        const foundCard = await cardModel.find({ type: cardType, rarity: { $lt: cardRarityMin, $gt: cardRarityMax } })
        return foundCard.map((value) => {
            return adapter(value)
        })
    },

    /**
     * Gets random cards by a specified amount.
     * @param {number} amount 
     * @returns 
     */
    getRandomCards: async (amount) => {
        const cards = await cardModel.aggregate([{ $project: projection }]).sample(amount).exec()
        return cards.map((value) => { return new Card(value) })
    }
}

export default cardDao;