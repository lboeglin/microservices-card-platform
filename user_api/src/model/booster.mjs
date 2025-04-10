'use strict'

// i guess we'll have to modify this ? maybe ? i'm doing it if no one does but im going to sleep (5:15AM :mimir:)
export class Booster {
    constructor(booster) {
        this.id = booster.id
        this.type = booster.type
        this.rarity = booster.rarity // price depends on rarity : 10 coins * rarity level (2 level of rarity)
        this.price = booster.price
        this.image = booster.image
        this.isAvailable = booster.isAvailable
    }
}
