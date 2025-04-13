import HttpsProxyAgent from 'https-proxy-agent'
import dotenv from 'dotenv'

dotenv.config()

const proxy = process.env.https_proxy

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

const urlBase = process.env.CARD_SERVICE_URL + process.env.API_PATH

const cardFetchDAO = (fetch, agent = defaultAgent) => ({
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
