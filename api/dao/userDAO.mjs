'use strict'

import { mongoose } from 'mongoose';
import { User } from '../model/user.mjs'

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    collection: {
        type: Object,
        required: false
    }
})

const UserDAO = mongoose.model('User', userSchema)

const userDao = {
    async getAllUsers() {
        // TODO
    },

    async getUserById(id) {
        // TODO
    },

    async getUserByEmail(email) {
        // TODO
    },

    async createUser(user) {
        // TODO
    }
}

export default userDao