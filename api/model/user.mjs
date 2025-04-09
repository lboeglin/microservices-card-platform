'use strict'

import { Collection } from './collection.mjs'
import { BoosterInventory } from "./booster.mjs";

export class User {
   login
    password
    coins
    collection
    boosters 
    constructor(obj) {
        this.name = obj.login
        this.password = obj.password
        this.coins = obj.coins

        // inventory (not sure if it is the right way to do it for the database)
        this.collection = new Collection(obj.collection)
        this.boosters = new BoosterInventory(obj.boosters)
    }
}