import { describe, it, before, after } from "node:test"
import supertest from "supertest"
import server from "../server.mjs"  
import { mongoose } from "mongoose"
import assert from "node:assert"
import { MongoMemoryServer } from "mongodb-memory-server"

let mongod = null
let maConnexion = null
const requestWithSupertest = supertest(server)
const APIPATH = process.env.API_PATH || "/api/v0"

describe("Card API Endpoints", function () {
    before(async () => {
        await mongoose.connection.close()
        mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        maConnexion = await mongoose.connect(uri)
    })

    after(async () => {
        await mongod.stop()
        maConnexion.disconnect()
    })

    describe("GET /get-cards/:amount", function () {
        it("should return a number of cards matching the requested amount", async () => {
            const amount = 3
            const response = await requestWithSupertest.get(`${APIPATH}/get-cards/${amount}`)
            
            assert.equal(response.status, 200)
            assert.equal(response.body.length, amount)
        })

        it("should return an empty array when requested amount is 0", async () => {
            const amount = 0
            const response = await requestWithSupertest.get(`${APIPATH}/get-cards/${amount}`)
            
            assert.equal(response.status, 200)
            assert.deepEqual(response.body, [])
        })
    })

    describe("GET /get-existing-cards", function () {
        it("should return all existing cards", async () => {
            const response = await requestWithSupertest.get(`${APIPATH}/get-existing-cards`)

            assert.equal(response.status, 200)
            assert(Array.isArray(response.body))
            assert(response.body.length > 0)  
        })
    })

    describe("GET /get-card-info/:id", function () {
        it("should return card details for a valid ID", async () => {
            await requestWithSupertest.get(`${APIPATH}/get-cards/3`)
            const newCardId = 1  

            const response = await requestWithSupertest.get(`${APIPATH}/get-card-info/${newCardId}`)
            
            assert.equal(response.status, 200)
            assert.equal(response.body.id, newCardId)
            assert.equal(typeof response.body.name, "string")
        })

    })

    describe("POST /get-collection-info", function () {
        it("should return multiple cards by their IDs", async () => {
            const cardIds = [1, 2] 

            const response = await requestWithSupertest.post(`${APIPATH}/get-collection-info`).send(cardIds)
            
            assert.equal(response.status, 200)
            assert(Array.isArray(response.body))
            assert(response.body.length === cardIds.length)
            assert.deepEqual(response.body.map(card => card.id), cardIds)
        })

    })
})

