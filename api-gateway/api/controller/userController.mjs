'use strict'

import userFetchDAO from '../dao/userFetchDAO.mjs'
import fetch from 'node-fetch'

const dao = userFetchDAO(fetch)

const userController = {

    login: async (credentials) => {
        return await dao.login(credentials)
    },

    register: async (userData) => {
        return await dao.register(userData)
    },

    refreshTokens: async (refreshTokenData) => {
        return await dao.refreshTokens(refreshTokenData)
    },

    getUser: async (jwt) => {
        return await dao.getUser(jwt)
    },

    updateUser: async (jwt, userData) => {
        return await dao.updateUser(jwt, userData)
    },

    deleteUser: async (jwt) => {
        return await dao.deleteUser(jwt)
    },

    updatePassword: async (jwt, passwordData) => {
        return await dao.updatePassword(jwt, passwordData)
    },

    getCollection: async (jwt) => {
        return await dao.getCollection(jwt)
    },

    sellCard: async (jwt, cardId) => {
        return await dao.sellCard(jwt, cardId)
    },

    addCard: async (jwt, cardData) => {
        return await dao.addCard(jwt, cardData)
    },

    getBooster: async (jwt) => {
        return await dao.getBooster(jwt)
    },

    useBooster: async (jwt) => {
        return await dao.useBooster(jwt)
    },

    buyBooster: async (jwt, price) => {
        return await dao.buyBooster(jwt, price)
    }
}

export default userController
