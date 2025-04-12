'use strict'

import cardFetchDAO from "../dao/cardFetchDAO.mjs"

const cardController = {
    
    getCard : async(id) =>{
        return await cardFetchDAO.findOne(id)
    },

    getCards : async(number) => {
        return await cardFetchDAO.findMany(number)
    },

    getCollection : async(collectionIds) => {
        return await cardFetchDAO.findCollection(collectionIds)
    }
}