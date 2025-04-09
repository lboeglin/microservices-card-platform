import { mongoose } from 'mongoose';
import { Card } from "../model/card.mjs";
import catFetchDAO from "./catFetchDAO.mjs";

const cardSchema = new mongoose.Schema({
    cardId: {
        type: Number,
        required: true,
        unique: true
    }
    , name: {
        type: String,
        required: true
    }
    , image: {
        type: String,
        required: true
    }
    , rarity: {
        type: Number,
        required: true
    }
    , type: {
        type: String,
        required: true
    }
    , health: {
        type: Number,
        required: true
    }
    , strength: {
        type: Number,
        required: true
    }
})

const cardModel = mongoose.model('Card', cardSchema)

const cardDao = {
    async getAllCards() {
        // TODO
    },

    // return a random card
    async getCard() {
        // TODO
    },

    async addCard(name, type, image) {
        // TODO, make sure the db create an id for the card
        const resFetch = catFetchDAO.findOne()
        const rarityFactor = Math.floor((Math.random() * 4) + 1)

        const newCard = {
            name: name,
            image: resFetch.image,
            rarity: rarityFactor,
            type: "cat",
            health: Math.floor(Math.random() * 5) + 1 + rarityFactor*2,
            strenght: Math.floor(Math.random() * 10) + 1 + rarityFactor*2,
        }

        await cardModel.insertOne(newCard)


        return cardDao.findOne() // TODO OSKOOR
    },

    async updateCard(cardId, cardData) {
        // TODO
    },

    async deleteCard(cardId) {
        // TODO
    },

    async getCardById(cardId) {
        // TODO
    },

    // return a random card matching the filters
    async getCardWithFilter(cardType, cardRarityMin, cardRarityMax) {
        // TODO
    },

    // return all cards of the type
    async getAllCardsWithFilter(cardType, cardRarityMin, cardRarityMax) {
        // TODO
    }
}

export default cardDao;