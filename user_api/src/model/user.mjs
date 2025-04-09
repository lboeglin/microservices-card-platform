'use strict'

import { Collection } from './collection.mjs'

export class User {
    constructor(user) {
        this.name = user.name
        this.password = user.password
        this.coins = i
        this.collection = new Collection(user.collection)
    }
}