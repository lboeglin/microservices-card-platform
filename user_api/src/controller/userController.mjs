'use strict'

import userDAO from "../dao/userDAO.mjs"

const userController = {
    getUserByName: async (name) => {
        return await userDAO.getUserByName(name)
    },

    register: async (name, password) => {
        return await userDAO.createUser(name, password) 
    },

    loginUser: async (name, password) => {
        return await userDAO.loginUser(name, password)
    },

    deleteUser: async (name) => {
        return await userDAO.deleteUserByName(name)
    },

    updateName: async (name, newName) => {
        return await userDAO.updateUserName(name, newName)
    },

    updatePassword: async (name, currentPassword, newPassword) => {
        return await userDAO.updatePassword(name, currentPassword, newPassword)
    },

    getCollection: async (name) => {
        const user = await userDAO.getUserByName(name)
        return user ? user.collection : [] 
    },

    sellCard: async (name, cardId) => {
        return await userDAO.sellCard(name, cardId)
    },

    addCards: async (name, cards) => {
        return await userDAO.addCards(name, cards)
    },

    claimBooster: async (name, currentTime) => {
        return await userDAO.claimBooster(name, currentTime)
    },

    buyBooster: async (name, price = 1) => {
        return await userDAO.buyBooster(name, price)
    },

    useBooster: async (name) => {
        return await userDAO.useBooster(name)
    }

}

export default userController
