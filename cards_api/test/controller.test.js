import mongoose from "mongoose"
import assert from "node:assert"
import { describe, it, before, after } from "node:test"
import { MongoMemoryServer } from "mongodb-memory-server"

import cardController from "../src/controller/CardController.mjs"
import cardDao from "../src/dao/CardDao.mjs"
import resourceFetcherDao from "../src/dao/ResourceFetcherDao.mjs"
import Card from "../src/model/Card.mjs"

let mongod = null
let maConnexion = null
let cardIdCounter = 100

describe("cardController", () => {
  before(async () => {
    await mongoose.connection.close()
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    maConnexion = await mongoose.connect(uri)

    // Reset state
    Card.existingCards = 0

    // Add known cards to DB
    await cardDao.addCard(new Card({
      id: cardIdCounter++,
      name: "CardOne",
      type: "fire",
      rarity: 2,
      image: "url1"
    }))

    await cardDao.addCard(new Card({
      id: cardIdCounter++,
      name: "CardTwo",
      type: "water",
      rarity: 3,
      image: "url2"
    }))
  })

  after(async () => {
    await mongod.stop()
    await maConnexion.disconnect()
  })

  it("should return all cards", async () => {
    const cards = await cardController.getAll()
    assert(cards.length >= 2)
    assert(cards.some(c => c.name === "CardOne"))
    assert(cards.some(c => c.name === "CardTwo"))
  })

  it("should return a card by ID", async () => {
    const existingCard = await cardDao.getAllCards().then(cards => cards[0])
    const card = await cardController.getFromId(existingCard.id)
    assert(card)
    assert.equal(card.id, existingCard.id)
  })

  it("should return null for non-existent card ID", async () => {
    const card = await cardController.getFromId(99999)
    assert.equal(card, null)
  })

  it("should generate new cards when needed", async () => {
    resourceFetcherDao.fetchMany = async () => ["MockName1", "MockName2"]

    resourceFetcherDao.fetchOne = async () => [
      { url: "mocked-image.png" }
    ]

    // Temporarily allow generation
    Card.existingCards = 0

    const cards = await cardController.getRandomCards(2)

    assert.equal(cards.length, 2)
    assert(cards.every(c => c.name.startsWith("MockName")))
    assert(cards.every(c => c.image.includes("mocked-image.png")))
  })

  it("should fetch random cards from database when needed", async () => {
    // Add a card manually to fetch
    const dbCard = new Card({
      id: cardIdCounter++,
      name: "FetchableCard",
      type: "air",
      rarity: 1,
      image: "url-fetch"
    })
    await cardDao.addCard(dbCard)

    // Prevent generation
    Card.existingCards = 9999

    const cards = await cardController.getRandomCards(1)

    assert.equal(cards.length, 1)
    assert(cards[0])
    assert(typeof cards[0].name === "string")
  })
})