'use strict'

import { mongoose } from 'mongoose'
import { User } from '../model/user.mjs'
import { hashPassword, verifyPassword } from '../utils/passwordUtils.mjs'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String, // Salt for hashing
        required: true
    },
    coins: {
        type: Number,
        required: true,
        min: 0
    },
    collection: {
        type: [String], 
        required: true,
        default: []
    }
})

const projection = { _id: 0, __v: 0 }

const adapter = (mongooseUser) => {
    if (!mongooseUser) {
        return null
    }
    mongooseUser = mongooseUser.toJSON()
    delete mongooseUser.salt
    return new User(mongooseUser)
}

const MongoUser = mongoose.model('User', userSchema)

const userDAO = {

    getUserByName: async (name) => {
        try {
            const user = await MongoUser.findOne({ name: name }, projection)
            return adapter(user)
        } catch (error) {
            throw error
        }
    },

    createUser: async (user) => {
        try {
            if (!user.name || !user.password || !user.salt) {
                return null
            }

            const res = await userDAO.getUserByName(user.name)
            if (res != null) {
                return null 
            }
            const newUser = new MongoUser(user)
            await newUser.save() 
            return userDAO.getUserByName(user.name) 
        } catch (error) {
            throw error
        }
    },

    loginUser: async (username, password) => {
        try {
            const user = await userDAO.getUserByName(username)
            if (!user) {
                return null 
            }

            const correct = await verifyPassword(user.password, password, user.salt)
            return correct ? user : null
        } catch (error) {
            throw error
        }
    },

    sellCard: async ({ userName, cardId }) => {
        try {
            const user = await userDAO.getUserByName(userName)
            if (!user) {
                return false 
            }

            if (!user.collection.includes(cardId)) {
                return false 
            }

            user.collection = user.collection.filter(id => id !== cardId)
            user.coins += 1

            await user.save() 
            return true
        } catch (error) {
            throw error
        }
    },

    updatePassword: async ({ name, newPassword, currentPassword }) => {
        try {
            const user = await userDAO.loginUser(name, currentPassword)
            if (!user) {
                return null 
            }

            const newSalt = crypto.randomBytes(128).toString('base64')
            const newHashedPassword = await hashPassword(newPassword, newSalt)

            user.password = newHashedPassword
            user.salt = newSalt

            await user.save() 
            return user
        } catch (error) {
            throw error
        }
    },

    deleteUserByName: async (name) => {
        try {
            const user = await userDAO.getUserByName(name)
            if (!user) {
                return false 
            }

            await MongoUser.deleteOne({ name: name })
            return true
        } catch (error) {
            throw error
        }
    }
}

export default userDAO
