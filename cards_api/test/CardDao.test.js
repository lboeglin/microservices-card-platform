'use strict'

import assert from 'node:assert'
import { suite, test, before, after } from 'node:test'
import Card, { CARD_RARITY } from '../src/model/Card.mjs'
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import cardDao from '../src/dao/CardDao.mjs'

let mongod=null
let maConnexion = null

suite("CardDao Tests", () => {

	before(async ()=>{
        await mongoose.connection.close()
        const {MongoMemoryServer}  = await import('mongodb-memory-server')
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        maConnexion = await mongoose.connect(uri)
    })



	test("Add a card", async () => {
		const card = new Card({
			id: 0,
			name: 'jane',
			rarity: CARD_RARITY.COMMON,
			image: 'none',
			type: 'human'
		})
		cardDao.addCard(card)
		assert.deepEqual(
			card,
			await cardDao.getCard(0)
		)
	})

	test("Get all cards", async () => {
		const cards = await cardDao.getAllCards()
		assert.strictEqual(cards.length, 1)
		assert.strictEqual(cards[0].name, 'jane')
	}
	)
	test("Get a card", async () => {
		const card = await cardDao.getCard(0)
		assert.strictEqual(card.name, 'jane')
		assert.strictEqual(card.rarity, CARD_RARITY.COMMON)
		assert.strictEqual(card.type, 'human')
	})
	test("Get a card that doesn't exist", async () => {
		const card = await cardDao.getCard(1)
		assert.strictEqual(card, null)
	})
	test("Get random cards", async () => {
		const cards = await cardDao.getRandomCards(1)
		assert.strictEqual(cards.length, 1)
		assert.strictEqual(cards[0].name, 'jane')
	})
	test("Get random cards with a limit", async () => {
		const cards = await cardDao.getRandomCards(0)
		assert.strictEqual(cards.length, 0)
	})
	
	after(async ()=>{
        await mongod.stop()
        maConnexion.disconnect()
            })

})