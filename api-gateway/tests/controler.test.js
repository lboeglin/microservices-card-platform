import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import userController from '../api/controller/controller.mjs'

const testUsername = `user_${Date.now()}`
const testPassword = 'pass123'

let tokens = {}
let jwt = ''
let refreshToken = ''

describe('userController (integration tests)', () => {
  before(async () => {
    const reg = await userController.register({ name: testUsername, password: testPassword })
    assert.equal(reg.message, 'User created')

    tokens = await userController.login({ name: testUsername, password: testPassword })
    jwt = tokens.accessToken
    refreshToken = tokens.refreshToken
    assert.ok(jwt)
    assert.ok(refreshToken)
  })

  it('should get user info', async () => {
    const user = await userController.getUser(jwt)
    assert.equal(user.name, testUsername)
  })

  it('should update user name', async () => {
    const newName = `${testUsername}_updated`
    const result = await userController.updateUser(jwt, { newName: newName })

    jwt = result.accessToken
    refreshToken = result.refreshToken
    assert.equal(newName, result.user.name)
  })

  it('should get an empty collection', async () => {
    const collection = await userController.getCollection(jwt)
    assert.ok(Array.isArray(collection))
  })

  it('should add and retrieve cards with booster', async () => {
    const before = await userController.getBooster(jwt)
    assert.ok(before >= 0)

    const used = await userController.useBooster(jwt)
    assert.equal(used.length, 6)

    const after = await userController.getBooster(jwt)
    assert.ok(after <= before)

    const collection = await userController.getCollection(jwt)
    assert.ok(collection.length >= 6)
  })

  it('should sell a card', async () => {
    const collection = await userController.getCollection(jwt)
    const cardId = collection[0].id

    const result = await userController.sellCard(jwt, cardId)
    assert.ok(result.coins !== undefined)
  })

  it('should refresh tokens', async () => {
    const refreshed = await userController.refreshTokens(jwt, refreshToken)
    assert.ok(refreshed.accessToken)
    assert.ok(refreshed.refreshToken)
    jwt = refreshed.accessToken
    refreshToken = refreshed.refreshToken
  })

  it('should update password', async () => {
    const result = await userController.updatePassword(jwt, {
      currentPassword: testPassword,
      newPassword: 'newpass456'
    })
    assert.ok(result.message || result.success)
  })

  it('should buy booster and return cards', async () => {
    const cards = await userController.buyBooster(jwt, 0)
    assert.equal(cards.length, 6)
  })

  it('should delete user', async () => {
    const result = await userController.deleteUser(jwt)
    assert.ok(result.message || result.success || result.deleted)
  })

  after(() => {
    console.log(`Cleaned up test user ${testUsername}`)
  })
})
