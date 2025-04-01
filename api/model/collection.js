'use strict'

export class Collection {
    constructor() {
        this.cardIds = []
    }

    addCard(cardId) {
        this.cardIds.push(cardId)
    }

    removeCard(cardId) {
        this.cardIds = this.cardIds.filter(id => id !== cardId)
    }

    getCards() {
        return this.cardIds
    }
}