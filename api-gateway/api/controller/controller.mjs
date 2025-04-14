'use strict'

import cardFetchDAO from '../dao/cardFetchDAO.mjs'
import userFetchDAO from '../dao/userFetchDAO.mjs'
import fetch from 'node-fetch'

const cardDao = cardFetchDAO(fetch)
const userDao = userFetchDAO(fetch)

/**
 * Controller for handling user-related business logic.
 * Combines user DAO and card DAO to orchestrate complex operations.
 */
const userController = {

    /**
     * Authenticates a user and returns access and refresh tokens.
     * @param {{name: string, password: string}} credentials - User login credentials.
     * @returns {Promise<{accessToken: string, refreshToken: string}>}
     * @throws Will throw if credentials are invalid.
     */
    login: async (credentials) => {
        return await userDao.login(credentials)
    },

    /**
     * Registers a new user.
     * @param {{name: string, password: string}} userData - User registration data.
     * @returns {Promise<{name: string, password: string}>}
     * @throws Will throw if the user already exists.
     */
    register: async (userData) => {
        return await userDao.register(userData)
    },

    /**
     * Refreshes user tokens using a refresh token.
     * @param {Object} refreshTokenData - Refresh token payload.
     * @returns {Promise<{accessToken: string, refreshToken: string}>}
     */
    refreshTokens: async (refreshTokenData) => {
        return await userDao.refreshTokens(refreshTokenData)
    },

    /**
     * Retrieves user information.
     * @param {string} jwt - JWT token for authentication.
     * @returns {Promise<Object>} - User data.
     */
    getUser: async (jwt) => {
        return await userDao.getUser(jwt)
    },

    /**
     * Updates user information.
     * @param {string} jwt - JWT token.
     * @param {Object} userData - Updated user data.
     * @returns {Promise<Object>} - Updated user object.
     */
    updateUser: async (jwt, userData) => {
        return await userDao.updateUser(jwt, userData)
    },

    /**
     * Deletes a user.
     * @param {string} jwt - JWT token.
     * @returns {Promise<Object>} - Confirmation of deletion.
     */
    deleteUser: async (jwt) => {
        return await userDao.deleteUser(jwt)
    },

    /**
     * Updates the user's password.
     * @param {string} jwt - JWT token.
     * @param {Object} passwordData - New password payload.
     * @returns {Promise<Object>}
     */
    updatePassword: async (jwt, passwordData) => {
        return await userDao.updatePassword(jwt, passwordData)
    },

    /**
     * Gets the user's collection with card details.
     * @param {string} jwt - JWT token.
     * @returns {Promise<Object[]>} - Card collection.
     */
    getCollection: async (jwt) => {
        const ids = await userDao.getCollection(jwt)
        return await cardDao.findCollection(ids)
    },

    /**
     * Allows the user to sell a card.
     * @param {string} jwt - JWT token.
     * @param {string} cardId - ID of the card to sell.
     * @returns {Promise<Object>}
     */
    sellCard: async (jwt, cardId) => {
        return await userDao.sellCard(jwt, cardId)
    },

    /**
     * Retrieves booster information for a user.
     * @param {string} jwt - JWT token.
     * @returns {Promise<Object>}
     */
    getBooster: async (jwt) => {
        return await userDao.getBooster(jwt)
    },

    /**
     * Uses a booster, adds the cards to the user's collection, and returns the cards.
     * @param {string} jwt - JWT token.
     * @returns {Promise<Object[]>} - Cards gained from booster.
     */
    useBooster: async (jwt) => {
        await userDao.useBooster(jwt)
        const cards = await cardDao.findMany(6)
        await userDao.addCard(jwt, { cards: cards.map((card) => card.id) })
        return cards
    },

    /**
     * Buys a booster pack, adds the cards to the user's collection, and returns the cards.
     * @param {string} jwt - JWT token.
     * @param {string|number} price - Booster price.
     * @returns {Promise<Object[]>} - Cards gained from booster.
     */
    buyBooster: async (jwt, price) => {
        await userDao.buyBooster(jwt, price)
        const cards = await cardDao.findMany(6)
        await userDao.addCard(jwt, { cards: cards.map((card) => card.id) })
        return cards
    }
}

export default userController
