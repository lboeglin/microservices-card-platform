'use strict'

import cardFetchDAO from '../dao/cardFetchDAO.mjs'
import userFetchDAO from '../dao/userFetchDAO.mjs'
import fetch from 'node-fetch'

const cardDao = cardFetchDAO(fetch)
const userDao = userFetchDAO(fetch)

const userController = {

    /**
     * Allows a valid user to log in, and receive session
     * tokens.
     * @param {{name: string, password: string}} credentials 
     * @returns {Promise<{accessToken: string, refreshToken: string}>}
     * @throws If credentials are invalid.
     */
    login: async (credentials) => {
        return await userDao.login(credentials)
    },

    /**
     * Tries to register a new user.
     * @param {{name: string, password: string}} userData 
     * @returns {Promise<{name: string, password: string}>}
     * @throws If the user already exists.
     */
    register: async (userData) => {
        return await userDao.register(userData)
    },

    refreshTokens: async (refreshTokenData) => {
        return await userDao.refreshTokens(refreshTokenData)
    },

    getUser: async (jwt) => {
        return await userDao.getUser(jwt)
    },

    updateUser: async (jwt, userData) => {
        return await userDao.updateUser(jwt, userData)
    },

    deleteUser: async (jwt) => {
        return await userDao.deleteUser(jwt)
    },

    updatePassword: async (jwt, passwordData) => {
        return await userDao.updatePassword(jwt, passwordData)
    },

    getCollection: async (jwt) => {
        const ids = await userDao.getCollection(jwt)
        return await cardDao.findCollection(ids)
    },

    sellCard: async (jwt, cardId) => {
        return await userDao.sellCard(jwt, cardId)
    },

    getBooster: async (jwt) => {
        return await userDao.getBooster(jwt)
    },

    useBooster: async (jwt) => {
        await userDao.useBooster(jwt)
        const cards = await cardDao.findMany(6)
        await userDao.addCard(jwt, { cards: cards.map((card) => { return card.id }) })
        return cards
    },

    buyBooster: async (jwt, price) => {
        await userDao.buyBooster(jwt, price)
        const cards = await cardDao.findMany(6)
        await userDao.addCard(jwt, { cards: cards.map((card) => { return card.id }) })
        return cards
    }
}

export default userController
