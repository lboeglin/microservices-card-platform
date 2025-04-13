'use strict'

import createCardFetchDAO from "../dao/cardFetchDAO.mjs"
import fetch from "node-fetch"

const dao = createCardFetchDAO(fetch)

const cardController = {
    getCard: async (id) => {
        return await dao.findOne(id)
    },

    getCards: async (number) => {
        return await dao.findMany(number)
    },

    getCollection: async (collectionIds) => {
        return await dao.findCollection(collectionIds)
    }
}

export default cardController
