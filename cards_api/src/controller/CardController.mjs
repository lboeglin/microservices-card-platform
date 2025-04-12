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

    /**
     * Returns an `amount` of cards.
     * The cards are either generated on the fly, or
     * fetched from the database depending on a few factors.
     * @param {number} amount 
     */
    getRandomCards: async (amount) => {
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
        const name_source = Config.sources.names[0]
        const names = (await resourceFetcherDao.fetchMany(name_source.multiple_names_src, name_source.multiple_names_param, amountToGenerate, '', name_source.api_key))
        for (let i = 0; i < amountToGenerate; i++) {
            // Take a random image source
            const image_source = Config.sources.images[Math.floor(Math.random() * Config.sources.images.length)]
            // Get a random image from it
            const image = image_source.cdn_root + (await resourceFetcherDao.fetchOne(image_source.single_image_src))[0][image_source.src_path]
            const newCard = new Card({
                id: Card.existingCards,
                name: names[i],
                type: image_source.source_type,
                rarity: getRarity(),
                image: image
            })
            await cardDao.addCard(newCard)
            cards.push(newCard)
        }
        return cards
    },

    getRandomCardsFiltered: async (amount, type, rarityMin, rarityMax) => {
        const cards = []
        for (let i = 0; i < amount; i++) {
            cards.push(cardDao.getCardWithFilter(type, rarityMin, rarityMax))
        }
        return cards
    },
}

export default cardController
