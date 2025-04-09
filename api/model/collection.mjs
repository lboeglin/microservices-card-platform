'use strict'

export class Collection {
    cards
    constructor(collection) {
        this.cards = collection ? collection.cards : []
    }

}