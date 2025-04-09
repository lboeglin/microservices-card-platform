'use strict'

class CardException extends Error {
    constructor (message) {
        super(message)
        this.name = "CardException"
    }
}

const requiredProperties = new Map([
    "id",
    "name",
    "image",
    "rarity",
    "type",
    "health",
    "strenght"
])

class Card {
    id
    name
    image
    rarity
    type
    health
    strenght

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

}

export default Card