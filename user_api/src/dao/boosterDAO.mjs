'use strict'

import mongoose from 'mongoose'
import { Booster } from '../model/booster.mjs'

const boosterSchema = new mongoose.Schema({
    boosterId: {
        type: Number,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    rarity: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true
    },
})

const projection = { _id: 0, __v:0}

const MongoBooster = mongoose.model('Booster', boosterSchema)

// TODO : make an adapter ?

const boosterDao = {

    // TODO : do we have an id for the boosters or not ?
    async getBooster(boosterId) {
        try {
            const booster = await MongoBooster.find({id : boosterId}, projection)
            return booster ? booster : null
        } catch(e) {
            throw e
        }
    },

    async getAllAvailable() {
        try {
            return await MongoBooster.find({isAvailable: true})
        } catch (error) {
            console.error('Error fetching available boosters:', error)
            throw error
        }
    }
}

export default boosterDao