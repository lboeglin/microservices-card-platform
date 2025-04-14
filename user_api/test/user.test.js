'use strict'


import User from "../src/model/user.mjs"
import assert from "node:assert"
import { describe, it } from "node:test"

describe('Invalid User', () => {
    let user = {}
    it ("empty parameter", () => {
        assert.throws(() => {new User(user)}, {
            name: 'UserException',
            message: 'Invalid user object'
        })
    })
    let user2 = {
        name: '',
        password: 'password',
        coins: 100,
        collection: []
    }
    it ("empty name", () => {
        assert.throws(() => {new User(user2)}, {
            name: 'UserException',
            message: 'Name is required'
        })
    })
    let user3 = {
        name: 'name',
        password: '',
        coins: 100,
        collection: []
    }
    it ("empty password", () => {
        assert.throws(() => {new User(user3)}, {
            name: 'UserException',
            message: 'Password is required'
        })
    })
    let user4 = {
        name: 'name',
        password: 'password',
        coins: -1,
        collection: []
    }
    it ("negative coins", () => {
        assert.throws(() => {new User(user4)}, {
            name: 'UserException',
            message: 'Coins must be a valid positive number'
        })
    })
    let user5 = {
        name: 'name',
        password: 'password',
        coins: 100,
        collection: ''
    }
    it ("Collection not an array", () => {
        assert.throws(() => {new User(user5)}, {
            name: 'UserException',
            message: 'Invalid user object'
        })
    })
    let user6 = {
        name: 'name',
        password: 'password',
        coins: 100,
        collection: [1, 2, 3]
    }
    it ("Collection not an array of card IDs", () => {
        assert.throws(() => {new User(user6)}, {
            name: 'UserException',
            message: 'Collection must be an array of card IDs'
        })
    })
    let user7 = {
        name: 'name',
        password: 'password',
        coins: 100,
        collection: ['1', '2', '3'],
        something: 'else'
    }
    it ("Extra attribute", () => {
        assert.throws(() => {new User(user7)}, {
            name: 'UserException',
            message: 'Invalid user object'
        })
    })
    let user8 = {
        name: 'name',
        coins: 100
    }
    it ("Missing attribute", () => {
        assert.throws(() => {new User(user8)}, {
            name: 'UserException',
            message: 'Invalid user object'
        })
    })
    let user9 = {
        name: 'name',
        password: 'password',
        coins: NaN,
        collection: ['1', '2', '3']
    }
    it ("NaN coins", () => {
        assert.throws(() => {new User(user9)}, {
            name: 'UserException',
            message: 'Coins must be a valid positive number'
        })
    })
})

describe('Valid User', ()=>{
    let user = {
        name : 'name',
        password : 'password',
        coins : 100,
        collection : ['1', '2', '3']
    }
    it('Valid user', ()=> {
        assert.doesNotThrow(() => {new User(user), 'Creating a valid user should not throw an error'})
    })
    let user2 = {
        name : 'name',
        password : 'password',
        coins : 100,
        collection : []
    }
    it('Valid user with empty collection', ()=> {
        assert.doesNotThrow(() => {new User(user2), 'Creating a valid user with empty collection should not throw an error'})
    })
    let user3 = {
        name : 'name',
        password : 'password',
        coins : 0,
        collection : ['1', '2', '3']
    }
    it('Valid user with 0 coins', ()=> {
        assert.doesNotThrow(() => {new User(user3), 'Creating a valid user with 0 coins should not throw an error'})
    })
    let user4 = {
        name : 'name',
        password : 'password',
        coins : 0,
        collection : []
    }
    it('Valid user with 0 coins and empty collection', ()=> {
        assert.doesNotThrow(() => {new User(user4), 'Creating a valid user with 0 coins and empty collection should not throw an error'})
    })
    let user5 = {
        name : 'name',
        password : 'password',
        coins : 100,
    }
    it('Valid user with default value for collection', ()=> {
        assert.doesNotThrow(() => {new User(user5), 'Creating a valid user with default value for collection should not throw an error'})
    })
    let user6 = {
        name : 'name',
        password : 'password',
        collection : ['1', '2', '3']
    }
    it('Valid user with default value for coins', ()=> {
        assert.doesNotThrow(() => {new User(user6), 'Creating a valid user with default value for coins should not throw an error'})
    })
    let user7 = {
        name : 'name',
        password : 'password'
    }
    it('Valid user with default value for coins and collection', ()=> {
        assert.doesNotThrow(() => {new User(user7), 'Creating a valid user with default value for coins and collection should not throw an error'})
    })
})