'use strict'

import { Collection } from './collection.mjs'
import { BoosterInventory } from "./booster.mjs";

export class User {
    constructor(user) {
        this.id = user.id
        this.name = user.name
        this.email = user.email
        this.password = user.password
        this.image = user.image
        this.coins = user.coins

        // inventory (not sure if it is the right way to do it for the database)
        this.collection = new Collection(user.collection)
        this.boosters = new BoosterInventory(user.boosters)
    }

    static fromJson(json) {
        return new User(json)
    }
}