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
        this.modifier = card.modifier // ex: foil, alternate, etc.
        this.health = card.health
        this.strenght = card.strenght
    }

    static fromJson (json) {
        return new Card(json)
    }

}
