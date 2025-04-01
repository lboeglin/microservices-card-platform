"use strict"
import cardDAO from "../dao/cardDAO.js";

const cardController = {
    getAll: async () => {
        return await cardDAO.getAllCards()
    },

    getFromId: async (id) => {
        return await cardDAO.getCardById(id)
    },

    getXRandom: async (x) => {
        const cards = []
        for (let i = 0; i < x; i++) {
            cards.push(cardDAO.getCard())
        }
        return cards
    },

    getXRandomByType: async (x, type) => {
        const cards = []
        for (let i = 0; i < x; i++) {
            cards.push(cardDAO.getCardByType(type))
        }
        return cards
    },
}

export default cardController
