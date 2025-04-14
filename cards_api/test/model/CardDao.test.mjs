'use strict'

import assert from 'node:assert'
import { suite, test } from 'node:test'
import Card, { CARD_RARITY } from '../../src/model/Card.mjs'
import cardDao from '../../src/dao/CardDao.mjs'

import '../../server.mjs'

suite("CardDao Tests", () => {
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
})