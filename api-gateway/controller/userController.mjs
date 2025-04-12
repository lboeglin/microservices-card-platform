'use strict'

import userFetchDAO from '../dao/userFetchDAO.mjs'

const userController = {

    login: async (credentials) => {
        return await userFetchDAO.login(credentials)
    },

    register: async (userData) => {
        return await userFetchDAO.register(userData)
    },

    refreshTokens: async (refreshTokenData) => {
        return await userFetchDAO.refreshTokens(refreshTokenData)
    },

    getUser: async (jwt) => {
        return await userFetchDAO.getUser(jwt)
    },

    updateUser: async (jwt, userData) => {
        return await userFetchDAO.updateUser(jwt, userData)
    },

    deleteUser: async (jwt) => {
        return await userFetchDAO.deleteUser(jwt)
    },

    updatePassword: async (jwt, passwordData) => {
        return await userFetchDAO.updatePassword(jwt, passwordData)
    },

    getCollection: async (jwt) => {
        return await userFetchDAO.getCollection(jwt)
    },

    sellCard: async (jwt, cardId) => {
        return await userFetchDAO.sellCard(jwt, cardId)
    },

    addCard: async (jwt, cardData) => {
        return await userFetchDAO.addCard(jwt, cardData)
    },

    getBooster: async (jwt) => {
        return await userFetchDAO.getBooster(jwt)
    },

    useBooster: async (jwt) => {
        return await userFetchDAO.useBooster(jwt)
    },

    buyBooster: async (jwt, price) => {
        return await userFetchDAO.buyBooster(jwt, price)
    }
}

export default userController
