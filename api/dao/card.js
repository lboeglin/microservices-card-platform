import {mongoose} from 'mongoose';
import {Card} from "../model/card";

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

const Card = mongoose.model('Card', cardSchema)

const cardDao = {
    async getAllCards() {
        // TODO
    },

    async getCardById(cardId) {
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