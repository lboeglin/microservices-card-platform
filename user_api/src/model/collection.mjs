'use strict'

export class Collection {
    constructor(collection) {
        this.cards = collection ? collection.cards : []
    }
}