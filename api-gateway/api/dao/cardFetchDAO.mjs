import HttpsProxyAgent from 'https-proxy-agent'
import dotenv from 'dotenv'

dotenv.config()

/**
 * HTTPS proxy URL from environment variables.
 * @type {string | undefined}
 */
const proxy = process.env.https_proxy

/**
 * Default HTTPS agent used for requests.
 * If a proxy is defined, uses `HttpsProxyAgent`; otherwise disables TLS verification.
 * @type {HttpsProxyAgent | null}
 */
const defaultAgent = proxy !== undefined
    ? (() => {
        console.log(`Using proxy: ${proxy}`)
        return new HttpsProxyAgent(proxy)
    })()
    : (() => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
        console.log('Not using proxy')
        return null
    })()

/**
 * Base URL for the card service API, composed from environment variables.
 * @type {string}
 */
const urlBase = process.env.CARD_SERVICE_URL + process.env.API_PATH

/**
 * Data Access Object (DAO) for interacting with a card service API.
 * Provides methods to fetch card data using HTTP requests.
 * 
 * @param {typeof fetch} fetch - The fetch implementation to use.
 * @param {HttpsProxyAgent | null} [agent=defaultAgent] - Optional HTTPS agent for proxy support.
 * @returns {{
 *   findOne: (id: string) => Promise<Object>,
 *   findCollection: (collectionIds: string[]) => Promise<Object>,
 *   findMany: (number: number) => Promise<Object>,
 *   findAll: () => Promise<Object>
 * }}
 */
const cardFetchDAO = (fetch, agent = defaultAgent) => ({
    /**
     * Fetches information for a single card by ID.
     * 
     * @param {string} id - The ID of the card to fetch.
     * @returns {Promise<Object>} The card information.
     */
    findOne: async (id) => {
        try {
            const url = new URL(`${urlBase}/get-card-info/${id}`)
            const response = await fetch(url.toString(), agent ? { agent } : {})
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`)
            }
            return await response.json()
        } catch (error) {
            console.error('Error fetching card data:', error)
            throw error
        }
    },

    /**
     * Fetches information for a collection of cards.
     * 
     * @param {string[]} collectionIds - An array of collection IDs to fetch.
     * @returns {Promise<Object>} The collection information.
     */
    findCollection: async (collectionIds) => {
        try {
            const url = new URL(`${urlBase}/get-collection-info`)
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(collectionIds),
                ...(agent && { agent })
            })
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`)
            }
            return await response.json()
        } catch (error) {
            console.error('Error fetching collection data:', error)
            throw error
        }
    },

    /**
     * Fetches a specified number of cards.
     * 
     * @param {number} number - The number of cards to fetch.
     * @returns {Promise<Object>} The card data.
     */
    findMany: async (number) => {
        try {
            const url = new URL(`${urlBase}/get-cards/${number}`)
            const response = await fetch(url.toString(), agent ? { agent } : {})
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`)
            }
            return await response.json()
        } catch (error) {
            console.error('Error fetching multiple cards:', error)
            throw error
        }
    },

    /**
     * Fetches all existing card data.
     * 
     * @returns {Promise<Object>} All card information.
     */
    findAll: async () => {
        try {
            const url = new URL(`${urlBase}/get-existing-cards`)
            const response = await fetch(url.toString(), agent ? { agent } : {})
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`)
            }
            return await response.json()
        } catch (error) {
            console.error('Error fetching all cards:', error)
            throw error
        }
    }
})

export default cardFetchDAO

