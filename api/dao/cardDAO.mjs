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

    async getCardById(cardId) {
        // TODO
    },

    // return a random card of the type
    async getCardByType(cardType) {
        // TODO
    },

    // return all cards of the type
    async getCardsByType(cardType) {
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
    }
}

export default cardDao;