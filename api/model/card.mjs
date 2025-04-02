'use strict'

export class Card {
    constructor (card) {
        // main properties
        this.id = card.id
        this.name = card.name
        this.image = card.image

        // gacha properties
        this.rarity = card.rarity
        this.type = card.type // cat, neko, criminal, etc.
        this.health = card.health
        this.strenght = card.strenght
    }

    static fromJson (json) {
        return new Card(json)
    }

    static generateCard(name, type, image) {
        const rarityFactor = Math.floor((Math.random() * 4) + 1)

        return new Card({
            name: name,
            image: image,
            rarity: rarityFactor,
            type: type,
            health: Math.floor(Math.random() * 10) + 1 + rarityFactor*2,
            strenght: Math.floor(Math.random() * 10) + 1 + rarityFactor*2,
        })
    }
}
