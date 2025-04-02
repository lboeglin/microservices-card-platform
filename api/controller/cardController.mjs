"use strict"
import cardDAO from "../dao/cardDAO.mjs";
import boosterDAO from "../dao/boosterDAO.mjs";

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

    getXRandomByFilter: async (x, type, rarityMin, rarityMax) => {
        const cards = []
        for (let i = 0; i < x; i++) {
            cards.push(cardDAO.getCardWithFilter(type, rarityMin, rarityMax))
        }
        return cards
    },

    getAvailableBooster: async () => {
        return await boosterDAO.getAllAvailable()
    },

    getBooster: async (cardType) => {
        const booster = []

        const luck = Math.floor(Math.random() * 100) + 1;
        if (luck <= 1) {
            booster.push(this.getXRandomByFilter(6, cardType, 2, 4)) // TODO move rarity constants to a config file
        } else if (luck <= 10) {
            booster.push(this.getXRandomByFilter(3, cardType, 1, 1))
            booster.push(this.getXRandomByFilter(3, cardType, 2, 4))
        } else {
            booster.push(this.getXRandomByFilter(5, cardType, 1, 1))
            booster.push(this.getXRandomByFilter(1, cardType, 2, 3))
        }

        return booster
    },

    getSpecialBooster: async (cardType) => {
        const booster = []
        booster.push(this.getXRandomByFilter(6, cardType, 2, 4))
        return booster
    },
}

export default cardController
