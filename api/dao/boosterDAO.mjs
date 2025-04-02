'use strict'

import mongoose from 'mongoose'

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

const BoosterDAO = mongoose.model('Booster', boosterSchema)

const boosterDao = {
    async getAllBoosters() {
        // TODO
    },

    async getBooster(boosterId) {
        // TODO
    },

    async addBooster(boosterData) {
        // TODO
    },

    async updateBooster(boosterId, boosterData) {
        // TODO
    },

    async deleteBooster(boosterId) {
        // TODO
    },

    async getAllAvailable() {
        try {
            return await BoosterDAO.find({isAvailable: true})
        } catch (error) {
            console.error('Error fetching available boosters:', error)
            throw error
        }
    }
}

export default boosterDao