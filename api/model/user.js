'use strict'

import { Collection } from './collection.js'

export class User {
    constructor(user) {
        this.id = user.id
        this.name = user.name
        this.email = user.email
        this.image = user.image
        this.collection = new Collection()
    }

    static fromJson(json) {
        return new User(json)
    }
}