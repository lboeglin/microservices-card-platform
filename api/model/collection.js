'use strict'

export class Collection {
    constructor(collection) {
        this.cards = collection ? collection.cards : []
    }

    static fromJson(json) {
        const cardIds = json.cards.map(card => card.id)
        return new Collection({ cards: cardIds })
    }
}