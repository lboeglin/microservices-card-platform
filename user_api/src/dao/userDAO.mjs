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
    return new User(mongooseUser)
}


const UserDAO = mongoose.model('User', userSchema)

const userDao = {
    
    getUserById : async (id) => {
        const user = await UserDAO.findById(id, projection)
        return adapter(user)
    },

    createUser : async (user) => {
        const res = await UserDAO.getUserById(user.name)
        if (res != null){
            return null
        }
        await UserDAO.insertOne(user)
        return UserDAO.getUserById(user.name)
    },

    // no idea what this function should do 
    loginUser : async (user) => {
        // TODO
    }

    //maybe do update methode if the user can udpate something idk i cant think straight 
}

export default userDao