import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import createCardFetchDAO from '../api/dao/cardFetchDAO.mjs'
import fetch from 'node-fetch'

const mockCard = (id) => ({
    id: Number(id),
    name: `Mock Card ${id}`,
    image: `https://example.com/images/${id}.png`,
    rarity: Number(id) % 5,
    type: 'cat'
})

// Silence console.error during tests to avoid noisy terminal output
beforeEach(() => {
  // Save the original console.error
  global._consoleError = console.error
  console.error = () => {} 
})

afterEach(() => {
  // Restore original console.error
  console.error = global._consoleError
})

describe('cardFetchDAO', () => {
    describe('findOne()', () => {
        const mockFetch = async (url) => {
            const parsedUrl = new URL(url)
            const id = parsedUrl.pathname.split('/').pop()  
            return {
                ok: true,
                json: async () => mockCard(id)
            }
        }

        const dao = createCardFetchDAO(mockFetch)

        it('should return a full card object with correct types', async () => {
            const result = await dao.findOne('123')

            assert.deepStrictEqual(result, {
                id: 123,
                name: 'Mock Card 123',
                image: 'https://example.com/images/123.png',
                rarity: 3,
                type: 'cat'
            })
        })

        it('should throw an error if findOne is called with an invalid id', async () => {
            const mockFetch = async () => ({
                ok: false,
                statusText: 'Card not found'
            })

            const dao = createCardFetchDAO(mockFetch)

            await assert.rejects(
                () => dao.findOne('nonexistent-id'),
                new Error('Error fetching data: Card not found')
            )
        })

        it('should throw if fetch returns invalid JSON', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => { throw new Error('Unexpected token < in JSON') }
            })

            const dao = createCardFetchDAO(mockFetch)

            await assert.rejects(
                () => dao.findOne('123'),
                /Unexpected token < in JSON/
            )
        })

        it('should handle fetch throwing a network error', async () => {
            const mockFetch = async () => {
                throw new Error('Network timeout')
            }

            const dao = createCardFetchDAO(mockFetch)

            await assert.rejects(
                () => dao.findOne('123'),
                /Network timeout/
            )
        })

        it('should handle empty results when findOne returns nothing', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => null 
            })

            const dao = createCardFetchDAO(mockFetch)
            const result = await dao.findOne('123')

            assert.equal(result, null)  
        })
    })

    describe('findMany()', () => {
        it('should return a list of card objects with numeric id/rarity', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => [mockCard('1'), mockCard('2')]
            })

            const dao = createCardFetchDAO(mockFetch)
            const result = await dao.findMany(2)

            assert.deepStrictEqual(result, [
                mockCard('1'),
                mockCard('2')
            ])
        })

        it('should throw if findMany is called with invalid parameters', async () => {
            const mockFetch = async () => ({
                ok: false,
                statusText: 'Invalid number of cards requested'
            })

            const dao = createCardFetchDAO(mockFetch)

            await assert.rejects(
                () => dao.findMany('invalid-parameter'),
                new Error('Error fetching data: Invalid number of cards requested')
            )
        })
    })

    describe('findCollection()', () => {
        it('should return a collection of cards with proper fields', async () => {
            const mockFetch = async (url, options) => {
                const ids = JSON.parse(options.body)
                return {
                    ok: true,
                    json: async () => ids.map(id => mockCard(id))
                }
            }
        
            const dao = createCardFetchDAO(mockFetch)
            const result = await dao.findCollection(['10', '20'])
        
            assert.deepStrictEqual(result, [mockCard('10'), mockCard('20')])
        })
        
        it('should throw if findCollection is called with empty array', async () => {
            const mockFetch = async () => ({
                ok: false,
                statusText: 'No IDs provided'
            })

            const dao = createCardFetchDAO(mockFetch)

            await assert.rejects(
                () => dao.findCollection([]),
                new Error('Error fetching data: No IDs provided')
            )
        })

        it('should throw an error if fetch returns a 404 status code', async () => {
            const mockFetch = async () => ({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            })

            const dao = createCardFetchDAO(mockFetch)

            await assert.rejects(
                () => dao.findCollection(['nonexistent-id']),
                new Error('Error fetching data: Not Found')
            )
        })

        it('should handle a large collection of cards', async () => {
            const mockFetch = async () => ({
                ok: true,
                json: async () => ({
                    collection: [
                        mockCard('1'),
                        mockCard('2'),
                        mockCard('3'),
                        mockCard('4'),
                        mockCard('5')
                    ]
                })
            })

            const dao = createCardFetchDAO(mockFetch)
            const result = await dao.findCollection(['1', '2', '3', '4', '5'])

            assert.deepStrictEqual(result.collection, [
                mockCard('1'),
                mockCard('2'),
                mockCard('3'),
                mockCard('4'),
                mockCard('5')
            ])
        })
    })

    describe('Integration test: cardFetchDAO', () => {
        const dao = createCardFetchDAO(fetch)
        it('should fetch a card by ID from the real API', async () => {
            const card = await dao.findOne('1') 

            assert.ok(card)
            assert.strictEqual(typeof card.name, 'string')
            assert.strictEqual(typeof card.id, 'number')
            assert.strictEqual(typeof card.rarity, 'number')
            assert.ok(card.image)
        })

        it('should fetch a collection of cards', async () => {
            const collection = await dao.findCollection([1, 2])
            assert.ok(Array.isArray(collection))
            assert.ok(collection.length > 0)
        })

        it('should return an error for an invalid ID', async () => {
            await assert.rejects(() => dao.findOne('invalid-id'), /Error fetching data/)
        })

        it('should fetch multiple cards', async () => {
            const cards = await dao.findMany(2) 
            assert.ok(Array.isArray(cards))
            assert.strictEqual(cards.length, 2)
            assert.strictEqual(typeof cards[0].name, 'string')
            assert.strictEqual(typeof cards[0].id, 'number')
            assert.strictEqual(typeof cards[0].rarity, 'number')
            assert.ok(cards[0].image)
        }) 

        it('should fetch all existing cards', async () => {
            const cards = await dao.findAll()
            assert.ok(Array.isArray(cards))
            assert.ok(cards.length > 0)
            assert.strictEqual(typeof cards[0].name, 'string')
            assert.strictEqual(typeof cards[0].id, 'number')
            assert.strictEqual(typeof cards[0].rarity, 'number')
            assert.ok(cards[0].image)
        })
    })
})


