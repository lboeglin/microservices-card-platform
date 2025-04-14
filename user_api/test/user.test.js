'use strict'

import User from "../src/model/user.mjs"
import assert from "node:assert"
import { describe, it } from "node:test"

describe('Test du model', () => {
  const now = Date.now()

  it("empty parameter", () => {
    assert.throws(() => new User({}), {
      name: 'UserException',
      message: 'Invalid user object'
    })
  })

  it("empty name", () => {
    const user = {
      name: '',
      password: 'password',
      salt: 'salt',
      coins: 100,
      collection: [],
      boosters: [],
      lastBooster: now
    }
    assert.throws(() => new User(user), {
      name: 'UserException',
      message: 'Name is required'
    })
  })

  it("empty password", () => {
    const user = {
      name: 'name',
      password: '',
      salt: 'salt',
      coins: 100,
      collection: [],
      boosters: [],
      lastBooster: now
    }
    assert.throws(() => new User(user), {
      name: 'UserException',
      message: 'Password is required'
    })
  })

  it("empty salt", () => {
    const user = {
      name: 'name',
      password: 'password',
      salt: '',
      coins: 100,
      collection: [],
      boosters: [],
      lastBooster: now
    }
    assert.throws(() => new User(user), {
      name: 'UserException',
      message: 'Salt is required'
    })
  })

  it("negative coins", () => {
    const user = {
      name: 'name',
      password: 'password',
      salt: 'salt',
      coins: -1,
      collection: [],
      boosters: [],
      lastBooster: now
    }
    assert.throws(() => new User(user), {
      name: 'UserException',
      message: 'Coins must be a valid positive number'
    })
  })

  it("NaN coins", () => {
    const user = {
      name: 'name',
      password: 'password',
      salt: 'salt',
      coins: NaN,
      collection: [],
      boosters: [],
      lastBooster: now
    }
    assert.throws(() => new User(user), {
      name: 'UserException',
      message: 'Coins must be a valid positive number'
    })
  })

  it("collection not an array", () => {
    const user = {
      name: 'name',
      password: 'password',
      salt: 'salt',
      coins: 100,
      collection: 'not-an-array',
      boosters: [],
      lastBooster: now
    }
    assert.throws(() => new User(user), {
      name: 'UserException',
      message: 'Invalid user object'
    })
  })

  it("collection contains non-numbers", () => {
    const user = {
      name: 'name',
      password: 'password',
      salt: 'salt',
      coins: 100,
      collection: ['a', 2, 3],
      boosters: [],
      lastBooster: now
    }
    assert.throws(() => new User(user), {
      name: 'UserException',
      message: 'Collection must be an array of numbers'
    })
  })

  it("more than 2 boosters", () => {
    const user = {
      name: 'name',
      password: 'password',
      salt: 'salt',
      coins: 100,
      collection: [],
      boosters: [now, now, now],
      lastBooster: now
    }
    assert.throws(() => new User(user), {
      name: 'UserException',
      message: 'Boosters array must contain at most 2 timestamps'
    })
  })

  it("invalid lastBooster timestamp", () => {
    const user = {
      name: 'name',
      password: 'password',
      salt: 'salt',
      coins: 100,
      collection: [],
      boosters: [],
      lastBooster: NaN
    }
    assert.throws(() => new User(user), {
      name: 'UserException',
      message: 'Timestamp must be a valid positive number'
    })
  })

  it("extra attribute", () => {
    const user = {
      name: 'name',
      password: 'password',
      salt: 'salt',
      coins: 100,
      collection: [],
      boosters: [],
      lastBooster: now,
      extra: 'nope'
    }
    assert.throws(() => new User(user), {
      name: 'UserException',
      message: 'Invalid user object'
    })
  })

  it("missing attribute", () => {
    const user = {
      password: 'password',
      salt: 'salt',
      coins: 100,
      collection: [],
      boosters: [],
      lastBooster: now
    }
    assert.throws(() => new User(user), {
      name: 'UserException',
      message: 'Invalid user object'
    })
  })

  it('valid user with full properties', () => {
    const user = {
      name: 'name',
      password: 'password',
      salt: 'salt',
      coins: 100,
      collection: [1, 2, 3],
      boosters: [now],
      lastBooster: now
    }
    assert.doesNotThrow(() => new User(user))
  })

  it('valid user with empty collection and boosters', () => {
    const user = {
      name: 'name',
      password: 'password',
      salt: 'salt',
      coins: 0,
      collection: [],
      boosters: [],
      lastBooster: now
    }
    assert.doesNotThrow(() => new User(user))
  })

  it('valid user with default values for optional fields', () => {
    const user = {
      name: 'name',
      password: 'password',
      salt: 'salt',
    }
    assert.doesNotThrow(() => new User(user))
  })
})
