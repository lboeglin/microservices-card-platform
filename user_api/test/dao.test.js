"use strict"

import userDAO from "../src/dao/userDAO.mjs"
import { describe, it, before, beforeEach, after } from "node:test"
import { mongoose } from "mongoose"
import assert from "node:assert"
import { MongoMemoryServer } from "mongodb-memory-server"

let mongod = null
let maConnexion = null

describe("Test du dao", function () {
  before(async () => {
    await mongoose.connection.close()
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    maConnexion = await mongoose.connect(uri)
  })

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase()
  })

  after(async () => {
    await mongod.stop()
    await maConnexion.disconnect()
  })

  it("create user and get info", async () => {
    const user = await userDAO.createUser("test", "pass")
    assert.equal(user.name, "test")
    assert.equal(user.coins, 10)
    assert.deepEqual(user.collection, [])
  })

  it("create user with existing name", async () => {
    await userDAO.createUser("test", "pass")
    const result = await userDAO.createUser("test", "pass")
    assert.equal(result, null)
  })

  it("login user with correct credentials", async () => {
    await userDAO.createUser("bob", "secret")
    const user = await userDAO.loginUser("bob", "secret")
    assert(user)
    assert.equal(user.name, "bob")
  })

  it("login user with wrong credentials", async () => {
    await userDAO.createUser("bob", "secret")
    const user = await userDAO.loginUser("bob", "wrongpass")
    assert.equal(user, null)
  })

  it("update user's name", async () => {
    await userDAO.createUser("alice", "pass")
    const updated = await userDAO.updateUserName("alice", "newAlice")
    assert(updated)
    assert.equal(updated.name, "newAlice")
  })

  it("update passwords", async () => {
    await userDAO.createUser("tom", "1234")
    await userDAO.updatePassword("tom", "1234", "5678")
    const user = await userDAO.loginUser("tom", "5678")
    assert(user)
  })

  it("delete user", async () => {
    await userDAO.createUser("deleteMe", "pass")
    const deleted = await userDAO.deleteUserByName("deleteMe")
    assert(deleted)
    const user = await userDAO.getUserByName("deleteMe")
    assert.equal(user, null)
  })

  it("sell card removes card and adds coin", async () => {
    const user = await userDAO.createUser("seller", "pass")
    await userDAO.addCards("seller", [1])
    const newCoins = await userDAO.sellCard("seller", 1)
    assert.equal(newCoins, 11)
    const updated = await userDAO.getUserByName("seller")
    assert(!updated.collection.includes(1))
  })

  it("sell card not owned", async () => {
    await userDAO.createUser("noCard", "pass")
    await assert.rejects(() => userDAO.sellCard("noCard", 42), /does not have this card/)
  })

  it("add 2 cards with 1 duplicate ", async () => {
    await userDAO.createUser("collector", "pass")
    await userDAO.addCards("collector", [5])
    const updated = await userDAO.addCards("collector", [5, 6])
    assert.deepEqual(updated.collection.sort(), [5, 6])
    assert.equal(updated.coins, 11)
  })

  it("claim booster up to two total boosters", async () => {
    const now = Date.now()
    await userDAO.createUser("boosterGuy", "pass")
  
    await userDAO.useBooster("boosterGuy")
    await userDAO.useBooster("boosterGuy")
  
    const boosterCount1 = await userDAO.claimBooster("boosterGuy", now)
    assert.equal(boosterCount1, 1)
  
    const boosterCount2 = await userDAO.claimBooster("boosterGuy", now + 1000)
    assert.equal(boosterCount2, 2)
  
    await assert.rejects(
      () => userDAO.claimBooster("boosterGuy", now + 2000),    )
  })
  

  it("buy booster with enough coins", async () => {
    await userDAO.createUser("buyer", "pass")
    const user = await userDAO.buyBooster("buyer", 5)
    assert.equal(user.coins, 5)
  })

  it("buy booster with not enough coins", async () => {
    await userDAO.createUser("poor", "pass")
    const user = await userDAO.buyBooster("poor", 999)
    assert.equal(user, null)
  })

  it("useBooster works and updates booster count", async () => {
    const now = Date.now()
    await userDAO.createUser("userBooster", "pass")
    const remaining = await userDAO.useBooster("userBooster")
    assert.equal(remaining, 1)
  })

  it("use booster with no boosters", async () => {
    await userDAO.createUser("emptyBooster", "pass")
    await userDAO.useBooster("emptyBooster")
    await userDAO.useBooster("emptyBooster")
    await assert.rejects(() => userDAO.useBooster("emptyBooster"), /no booster/)
  })
})
