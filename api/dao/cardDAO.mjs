import { mongoose } from 'mongoose';
import { Card } from "../model/card.mjs";

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
    , link: {
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
    , modifier: {
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

const CardDAO = mongoose.model('Card', cardSchema)

const cardDao = {
    async getAllCards() {
        // TODO
    },

    // return a random card
    async getCard() {
        // TODO
    },

    async addCard(cardData) {
        // TODO
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