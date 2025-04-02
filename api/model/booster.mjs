'use strict'

export class Booster {
    constructor(booster) {
        this.id = booster.id
        this.type = booster.type
        this.rarity = booster.rarity // price depends on rarity : 10 coins * rarity level (2 level of rarity)
        this.price = booster.price
        this.image = booster.image
        this.isAvailable = booster.isAvailable
    }

    static fromJson(json) {
        return new Booster(json)
    }
}

export class BoosterInventory {
    constructor(boosterInventory) {
        this.boosters = boosterInventory.boosters
        this.coins = boosterInventory.coins
    }

    static fromJson(json) {
        return new BoosterInventory(json)
    }
}