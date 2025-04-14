import { describe, it, beforeEach, afterEach, before, after } from 'node:test'
import assert from 'node:assert/strict'
import createUserFetchDAO from '../api/dao/userFetchDAO.mjs'
import fetch from 'node-fetch'

const mockUser = {
    name: "MockUser",
    password: "hashedpassword",
    salt: "randomsalt",
    coins: 100,
    collection: [1, 2, 3],
    booster: [10, 11],
    lastBooster: Date.now()
}

const jwt = 'mock.jwt.token'

beforeEach(() => {
    global._consoleError = console.error
    console.error = () => {}
})

afterEach(() => {
    console.error = global._consoleError
})

describe('userFetchDAO', () => {
    describe('Authentication and User Info', () => {
        it('login should return user info on success', async () => {
            const mockFetch = async (url, options) => ({
                ok: true,
                json: async () => ({ ...mockUser, token: jwt })
            })

            const dao = createUserFetchDAO(mockFetch)
            const result = await dao.login({ name: 'MockUser', password: 'password123' })
            assert.equal(result.name, 'MockUser')
            assert.ok(result.token)
        })

        it('register should return new user data', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => ({ ...mockUser, name: "NewUser" })
            })

            const dao = createUserFetchDAO(mockFetch)
            const result = await dao.register({ name: 'NewUser', password: 'secret' })
            assert.equal(result.name, 'NewUser')
        })

        it('refreshTokens should return a new token', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => ({ token: 'new.jwt.token' })
            })

            const dao = createUserFetchDAO(mockFetch)
            const result = await dao.refreshTokens({ refreshToken: 'old-token' })
            assert.ok(result.token)
        })

        it('getUser should return user info with valid JWT', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => mockUser
            })

            const dao = createUserFetchDAO(mockFetch)
            const result = await dao.getUser(jwt)
            assert.deepStrictEqual(result, mockUser)
        })

        it('updateUser should return updated user data', async () => {
            const updated = { ...mockUser, coins: 200 }

            const mockFetch = async () => ({
                ok: true,
                json: async () => updated
            })

            const dao = createUserFetchDAO(mockFetch)
            const result = await dao.updateUser(jwt, updated)
            assert.equal(result.coins, 200)
        })

        it('deleteUser should return success response', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => ({ success: true })
            })

            const dao = createUserFetchDAO(mockFetch)
            const result = await dao.deleteUser(jwt)
            assert.deepStrictEqual(result, { success: true })
        })
    })

    describe('Password and Collection', () => {
        it('updatePassword should succeed', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => ({ message: 'Password updated' })
            })

            const dao = createUserFetchDAO(mockFetch)
            const result = await dao.updatePassword(jwt, { password: 'newpass' })
            assert.equal(result.message, 'Password updated')
        })

        it('getCollection should return user collection', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => ({ collection: mockUser.collection })
            })

            const dao = createUserFetchDAO(mockFetch)
            const result = await dao.getCollection(jwt)
            assert.deepStrictEqual(result.collection, mockUser.collection)
        })
    })

    describe('Card and Booster Operations', () => {
        it('sellCard should return updated user data', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => ({ coins: 110 })
            })

            const dao = createUserFetchDAO(mockFetch)
            const result = await dao.sellCard(jwt, 1)
            assert.equal(result.coins, 110)
        })

        it('addCard should add card to user collection', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => ({ collection: [1, 2, 3, 4] })
            })

            const dao = createUserFetchDAO(mockFetch)
            const result = await dao.addCard(jwt, { id: 4 })
            assert.deepStrictEqual(result.collection, [1, 2, 3, 4])
        })

        it('getBooster should return a booster object', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => ({ booster: [21, 22, 23] })
            })

            const dao = createUserFetchDAO(mockFetch)
            const result = await dao.getBooster(jwt)
            assert.ok(Array.isArray(result.booster))
        })

        it('useBooster should return updated collection', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => ({ collection: [1, 2, 3, 99] })
            })

            const dao = createUserFetchDAO(mockFetch)
            const result = await dao.useBooster(jwt)
            assert.ok(result.collection.includes(99))
        })

        it('buyBooster should deduct coins and return booster info', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => ({ coins: 80, booster: [30, 31] })
            })

            const dao = createUserFetchDAO(mockFetch)
            const result = await dao.buyBooster(jwt, 20)
            assert.equal(result.coins, 80)
        })
    })

    describe('Error handling', () => {
        it('should throw on failed POST request', async () => {
            const mockFetch = async () => ({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
                text: async () => 'Invalid data'
            })

            const dao = createUserFetchDAO(mockFetch)
            await assert.rejects(
                () => dao.register({}),
                /400 Bad Request/
            )
        })

        it('should throw on failed GET request', async () => {
            const mockFetch = async () => ({
                ok: false,
                status: 403,
                statusText: 'Forbidden',
                text: async () => 'Invalid token'
            })

            const dao = createUserFetchDAO(mockFetch)
            await assert.rejects(
                () => dao.getUser(jwt),
                /403 Forbidden/
            )
        })
    })

    describe('userFetchDAO (integration test with real API)', () => {
        const dao = createUserFetchDAO(fetch)
        const testUsername = `integration_user` + Math.floor(Math.random() * 10000)
        const testPassword = 'testpassword123'

        let token = ''
        let user = null

        before(async () => {
            // Register user
            await dao.register({ name: testUsername, password: testPassword })

            // Login and store token
            const loginRes = await dao.login({ name: testUsername, password: testPassword })
            token = loginRes.accessToken
            user = loginRes
        })

        it('should get user info with token', async () => {
            const fetched = await dao.getUser(token)
            assert.equal(fetched.name, testUsername)
            assert.ok(fetched.collection)
        })

        it('should update the username and return new tokens', async () => {
            const newName = testUsername + '_updated_'
        
            const updatedResponse = await dao.updateUser(token, {newName: newName})
        
            assert.ok(updatedResponse.user, 'Missing user object')
            assert.equal(updatedResponse.user.name, newName)
        
            assert.ok(updatedResponse.accessToken, 'Missing new access token')
            assert.ok(updatedResponse.refreshToken, 'Missing refresh token')
        
            user = updatedResponse.user
            token = updatedResponse.accessToken
        })
        

        it('should return an empty collection array', async () => {
            const result = await dao.getCollection(token)
            assert.ok(Array.isArray(result))
            assert.equal(result.length, 0)
        })

        it('should add a card to collection', async () => {
            const added = await dao.addCard(token, { cards: [1, 2, 3, 4] })
            assert.equal(added.message, 'Cards added')
        })        

        it('should return a collection with cards', async () => {
            const result = await dao.getCollection(token)
            assert.ok(Array.isArray(result))
            assert.ok(result.length > 0)
        })

        it('should get a booster full', async () => {
            const result = await dao.getBooster(token)
            assert.strictEqual(result, 2)
        })

        it('should use a booster', async () => {
            const result = await dao.useBooster(token)
            assert.ok(Array.isArray(result.collection))
        })

        it('should get a booster -1', async () => {
            const result = await dao.getBooster(token)
            assert.strictEqual(result, 1)
        })
        
        it('should buy a booster', async () => {
            const result = await dao.buyBooster(token, 10)
            assert.ok(result.booster)
            assert.ok(result.coins)
        })


        it('should update password', async () => {
            const result = await dao.updatePassword(token, { password: 'newpass123' })
            assert.equal(result.message, 'Password updated')
        })

        it('should delete user', async () => {
            const result = await dao.deleteUser(token)
            assert.deepEqual(result, { success: true })
        })

        after(() => {
            console.log(`✅ Cleaned up test user ${testUsername}`)
        })
    })
})


