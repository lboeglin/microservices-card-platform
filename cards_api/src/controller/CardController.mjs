"use strict"
import Config from "../../config.mjs";
import cardDao from "../dao/CardDao.mjs";
import resourceFetcherDao from "../dao/ResourceFetcherDao.mjs";
import Card, { CARD_RARITY, getRarity } from "../model/Card.mjs";

const cardController = {
    getAll: async () => {
        return await cardDao.getAllCards()
    },

    getFromId: async (id) => {
        return await cardDao.getCard(id)
    },

    getRandom: async (amount) => {
        const amountToGenerate = Math.min(
            Config.maxAmountOfStoredCards - Card.existingCards,
            Math.max(amount - Card.existingCards, Math.round(Math.random() * amount)),
        )
        const amountToFetch = amount - amountToGenerate
        const cards = []
        console.log('amount to fetch: %d, amount to generate: %d', amountToFetch, amountToGenerate)
        if (amountToFetch > 0) {
            cards.push(
                await cardDao.getRandomCards(amountToFetch)
            )
        }
        for (let i = 0; i < amountToGenerate; i++) {
            // Take a random image source
            const image_source = Config.sources.images[Math.floor(Math.random() * Config.sources.images.length)]
            // Get a random image from it
            const image = (await resourceFetcherDao.fetchOne(image_source.single_image_src))[0][image_source.src_path]
            const newCard = new Card({
                id: Card.existingCards,
                name: 'Ichika', // oops all ichika
                type: image_source.source_type,
                rarity: getRarity(),
                image: image
            })
            await cardDao.addCard(newCard)
            cards.push(newCard)
        }
        return cards
    },

    getXRandomByFilter: async (x, type, rarityMin, rarityMax) => {
        const cards = []
        for (let i = 0; i < x; i++) {
            cards.push(cardDao.getCardWithFilter(type, rarityMin, rarityMax))
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
