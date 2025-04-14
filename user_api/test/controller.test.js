import mongoose from "mongoose"
import assert from "node:assert"
import { describe, it, before, after } from "node:test"
import { MongoMemoryServer } from "mongodb-memory-server"
import userController from "../src/controller/userController.mjs"

let mongod = null
let maConnexion = null

describe("userController", () => {
  before(async () => {
    await mongoose.connection.close()
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    maConnexion = await mongoose.connect(uri)
  })

  after(async () => {
    await mongod.stop()
    await maConnexion.disconnect()
  })

  it("should register a new user", async () => {
    const user = await userController.register("Alice", "password123")
    assert.equal(user.name, "Alice")
    assert.equal(user.coins, 10)
    assert.deepEqual(user.collection, [])
  })

  it("should not allow duplicate user registration", async () => {
    const user = await userController.register("Alice", "newpass")
    assert.equal(user, null)
  })

  it("should fetch a user by name", async () => {
    const user = await userController.getUserByName("Alice")
    assert.equal(user.name, "Alice")
  })

  it("should return null for non-existent user", async () => {
    const user = await userController.getUserByName("Bob")
    assert.equal(user, null)
  })

  it("should login the user with correct credentials", async () => {
    const user = await userController.loginUser("Alice", "password123")
    assert.equal(user.name, "Alice")
  })

  it("should fail login with wrong password", async () => {
    const user = await userController.loginUser("Alice", "wrongpass")
    assert.equal(user, null)
  })

  it("should update user name", async () => {
    const updated = await userController.updateName("Alice", "AliceNew")
    assert.equal(updated.name, "AliceNew")
  })

  it("should not update to an already existing name", async () => {
    await userController.register("Dup", "abc")
    const result = await userController.updateName("AliceNew", "Dup")
    assert.equal(result, null)
  })

  it("should update user password", async () => {
    const updated = await userController.updatePassword("AliceNew", "password123", "newpass123")
    assert.equal(updated.name, "AliceNew")
  })

  it("should not update password with wrong current password", async () => {
    const result = await userController.updatePassword("AliceNew", "wrongcurrent", "newpass")
    assert.equal(result, null)
  })

  it("should return empty collection initially", async () => {
    const collection = await userController.getCollection("AliceNew")
    assert.deepEqual(collection, [])
  })

  it("should add cards to user collection", async () => {
    const updated = await userController.addCards("AliceNew", [1, 2])
    assert.deepEqual(updated.collection, [1, 2])
  })

  it("should add coins if duplicate card is added", async () => {
    const before = await userController.getUserByName("AliceNew")
    const updated = await userController.addCards("AliceNew", [2, 3])
    const after = await userController.getUserByName("AliceNew")
    assert.deepEqual(updated.collection.sort(), [1, 2, 3])
    assert(after.coins === before.coins + 1)
  })

  it("should sell a card and gain coins", async () => {
    const before = await userController.getUserByName("AliceNew")
    const coins = await userController.sellCard("AliceNew", 2)
    assert.equal(coins, before.coins + 1)
    const after = await userController.getUserByName("AliceNew")
    assert(!after.collection.includes(2))
  })

  it("should not sell a card the user does not own", async () => {
    await assert.rejects(() => userController.sellCard("AliceNew", 999), /does not have this card/)
  })

  it("should buy a booster if enough coins", async () => {
    const before = await userController.getUserByName("AliceNew")
    const updated = await userController.buyBooster("AliceNew", 1)
    assert(updated.coins === before.coins - 1)
  })

  it("should not buy booster if not enough coins", async () => {
    await userController.updatePassword("AliceNew", "newpass123", "reset")
    const user = await userController.getUserByName("AliceNew")
    user.coins = 0
    await mongoose.connection.collection("users").updateOne(
      { name: "AliceNew" },
      { $set: { coins: 0 } }
    )
    const result = await userController.buyBooster("AliceNew", 1)
    assert.equal(result, null)
  })

  it("should claim a booster if under limit", async () => {
    await userController.useBooster("AliceNew")
    const user = await userController.getUserByName("AliceNew")

    if (user.boosters.length < 2) {
      const newCount = await userController.claimBooster("AliceNew", Date.now())
      assert(newCount <= 2)
    }
  })

  it("should reject claiming more than 2 boosters", async () => {
    const name = "LimitTester"
    await userController.register(name, "pass")
    await assert.rejects(() => userController.claimBooster(name, Date.now()), /Max 2 booster/)
  })

  it("should use a booster and decrease count", async () => {
    const name = "BoosterUser"
    await userController.register(name, "pass")
    const before = await userController.getUserByName(name)
    const result = await userController.useBooster(name)
    assert.equal(result, before.boosters.length - 1)
  })

  it("should throw error if no boosters to use", async () => {
    const name = "EmptyBooster"
    await userController.register(name, "pass")
    await userController.useBooster(name)
    await userController.useBooster(name)
    await assert.rejects(() => userController.useBooster(name), /no booster available/)
  })

  it("should delete user", async () => {
    const deleted = await userController.deleteUser("AliceNew")
    assert.equal(deleted, true)
    const check = await userController.getUserByName("AliceNew")
    assert.equal(check, null)
  })
})
