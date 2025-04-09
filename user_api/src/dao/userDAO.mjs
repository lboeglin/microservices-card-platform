'use strict'

import { mongoose } from 'mongoose';
import { User } from '../model/user.mjs'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    collection: {
        type: Object,
        required: false
    }
})

const UserDAO = mongoose.model('User', userSchema)

const userDao = {
    
    async getUserById(id) {
        // TODO
    },

    async createUser(user) {
        // TODO
    },

    async loginUser(user) {
        // TODO
    }
}

export default userDao