import request from 'supertest'
import express from 'express'
import router from '../api/routes/routes.mjs'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

const app = express()
app.use(express.json())
app.use('/', router)

describe('Express Router Integration (userRoute + router.mjs)', () => {
  const testUser = `routerUser_${Date.now()}`
  const testPass = 'routerPass123'

  let jwt = ''
  let refreshToken = ''

  it('should register a new user', async () => {
    const res = await request(app).post('/user/register').send({ name: testUser, password: testPass })
    assert.equal(res.statusCode, 201)
    assert.match(res.body.message, /User created/i)
  })

  it('should login and receive tokens', async () => {
    const res = await request(app).post('/user/login').send({ name: testUser, password: testPass })
    assert.equal(res.statusCode, 200)
    jwt = res.body.accessToken
    refreshToken = res.body.refreshToken
    assert.ok(jwt)
    assert.ok(refreshToken)
  })

  it('should refresh tokens with refresh-token only', async () => {
    console.log('Refresh token:', refreshToken)
    const res = await request(app).post('/user/refresh-tokens').set('Authorization', `Bearer ${refreshToken}`)
    assert.equal(res.statusCode, 200)
    assert.ok(res.body.accessToken)
    assert.ok(res.body.refreshToken)
    jwt = res.body.accessToken
    refreshToken = res.body.refreshToken
  })

  it('should get user info with valid JWT', async () => {
    const res = await request(app).get('/user').set('Authorization', `Bearer ${jwt}`)
    assert.equal(res.statusCode, 200)
    assert.equal(res.body.name, testUser)
  })

  it('should reject user info without JWT', async () => {
    const res = await request(app).get('/user')
    assert.equal(res.statusCode, 401)
    assert.deepEqual(res.body.message, 'No token provided')
  })

  it('should update username', async () => {
    const newName = `${testUser}_updated`
    const res = await request(app).put('/user').set('Authorization', `Bearer ${jwt}`).send({ newName })
    assert.equal(res.statusCode, 200)
    assert.equal(res.body.user.name, newName)
    jwt = res.body.accessToken
    refreshToken = res.body.refreshToken
  })

  it('should retrieve empty collection', async () => {
    const res = await request(app).get('/user/collection').set('Authorization', `Bearer ${jwt}`)
    assert.equal(res.statusCode, 200)
    assert.ok(Array.isArray(res.body))
  })

  it('should get and use a booster', async () => {
    const boosterBefore = await request(app).put('/user/booster').set('Authorization', `Bearer ${jwt}`)
    assert.equal(boosterBefore.statusCode, 200)

    const usedBooster = await request(app).put('/user/booster/use').set('Authorization', `Bearer ${jwt}`)
    assert.equal(usedBooster.statusCode, 200)
    assert.ok(Array.isArray(usedBooster.body))
    assert.equal(usedBooster.body.length, 6)
  })

  it('should sell a card', async () => {
    const collectionRes = await request(app).get('/user/collection').set('Authorization', `Bearer ${jwt}`)
    const cardId = collectionRes.body[0]?.id
    const res = await request(app).put(`/user/sell-card/${cardId}`).set('Authorization', `Bearer ${jwt}`)
    assert.equal(res.statusCode, 200)
    assert.ok(res.body.coins)
  })

  it('should buy a booster', async () => {
    const res = await request(app).put('/user/booster/buy/0').set('Authorization', `Bearer ${jwt}`)
    assert.equal(res.statusCode, 200)
    assert.ok(Array.isArray(res.body))
    assert.equal(res.body.length, 6)
  })

  it('should update password', async () => {
    const res = await request(app).put('/user/password')
      .set('Authorization', `Bearer ${jwt}`)
      .send({ currentPassword: testPass, newPassword: 'newRouterPass456' })
    assert.equal(res.statusCode, 200)
    assert.ok(res.body.message || res.body.success)
  })

  it('should delete user', async () => {
    const res = await request(app).delete('/user').set('Authorization', `Bearer ${jwt}`)
    assert.equal(res.statusCode, 200)
    assert.ok(res.body.message || res.body.deleted)
  })
})