"use strict"
import cardDAO from "../dao/card.js";

const cardController = {
    findAll: async () => {
        return await cardDAO.findAll()
    },
    findFromId: async (id) => {
        return await cardDAO.findOne(id)
    }
}

export default cardController
