'use strict'

import userDAO from "../dao/userDAO.mjs"
import { hashPassword } from "../utils/hashing.mjs" 

const userController = {
    loginUser: async (username, password) => {
        const user = await userDAO.getUserByName(username)
        if (!user) {
            return null
        }

        const correct = await userDAO.verifyPassword(user.password, password, user.salt)
        return correct ? user : null
    },

    register: async ({ username, password }) => {
        const user = await userDAO.getUserByName(username)
        if (user) {
            return null 
        }

        const salt = crypto.randomBytes(128).toString('base64')
        const hashedPassword = await hashPassword(password, salt)

        const newUser = {
            name: username,
            password: hashedPassword,
            salt: salt,
            coins: 10,           
            collection: []
        }

        await userDAO.createUser(newUser)
        return newUser
    },

    getUserByName: async (name) => {
        return await userDAO.getUserByName(name)
    },

    deleteUser: async (name) => {
        return await userDAO.deleteUserByName(name)
    },

    getCollection: async (name) => {
        const user = await userDAO.getUserByName(name)
        return user ? user.collection : [] 
    },

    sellCard: async (username, cardId) => {
        return await userDAO.sellCard({ userName: username, cardId: cardId })
    }
}

export default userController
