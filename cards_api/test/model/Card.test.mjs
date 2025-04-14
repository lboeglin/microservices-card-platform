'use strict'

import test, { suite } from 'node:test'
import Card, { CARD_RARITY } from '../../src/model/Card.mjs'
import assert from 'node:assert'

suite('Card Creation Tests', () => {

	test('Valid Card Creation 1', () => {
		assert.doesNotThrow(() => {
			let card = new Card({
				id: 0,
				image: "/path/to/image",
				name: "jane",
				rarity: CARD_RARITY.COMMON, // 0
				type: "human"
			})
		})
	})

	test('Valid Card Creation 2', () => {
		assert.doesNotThrow(() => {
			let card = new Card({
				id: 2,
				image: "/path/to/another_image",
				name: "jane",
				rarity: CARD_RARITY.SUPER_RARE, // 3
				type: "non-human"
			})
		})
	})

	test('Invalid Card Creation 1', () => {
		assert.throws(() => {
			let card = new Card({
				id: 4,
				image: "/path/to/another_image",
				name: "jane",
				rarity: -1,
				type: "non-human"
			})
		})
	})

	test('Invalid Card Creation 2', () => {
		assert.throws(() => {
			let card = new Card({
				id: 1,
				image: "/path/to/another_image",
				name: "jane",
				rarity: 4,
				type: "non-human"
			})
		})
	})

	test('Invalid Card Creation 3', () => {
		assert.throws(() => {
			let card = new Card({})
		})
	})

	test('Invalid Card Creation 4', () => {
		assert.throws(() => {
			let card = new Card({
				id: 1,
				image: "/path/to/another_image",
				name: "jane",
				rarity: 4,
				type: "non-human",
				a_sneaky_unuseful_attribute: "i'm gonna fail this test whole career"
			})
		})
	})

})