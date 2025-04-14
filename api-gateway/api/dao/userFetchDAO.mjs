import HttpsProxyAgent from 'https-proxy-agent'
import dotenv from 'dotenv'
dotenv.config()

/**
 * HTTPS proxy URL from environment variables.
 * @type {string | undefined}
 */
const proxy = process.env.https_proxy

/**
 * Optional HTTPS agent for making requests through a proxy.
 * If a proxy is configured, uses HttpsProxyAgent. Otherwise disables TLS verification.
 * @type {HttpsProxyAgent | null}
 */
let agent = null
if (proxy !== undefined) {
    console.log(`Using proxy: ${proxy}`)
    agent = new HttpsProxyAgent(proxy)
} else {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    console.log('Not using proxy')
}

/**
 * Base URL for the user service API.
 * @type {string}
 */
const urlBase = process.env.USER_SERVICE_URL + "/user-api"

/**
 * Factory function returning a DAO for user-related API interactions.
 * 
 * @param {typeof fetch} fetch - The fetch implementation to use.
 * @returns {{
 *   login: (credentials: Object) => Promise<Object>,
 *   register: (userData: Object) => Promise<Object>,
 *   refreshTokens: (refreshTokenData: Object) => Promise<Object>,
 *   getUser: (jwt: string) => Promise<Object>,
 *   updateUser: (jwt: string, userData: Object) => Promise<Object>,
 *   deleteUser: (jwt: string) => Promise<Object>,
 *   updatePassword: (jwt: string, passwordData: Object) => Promise<Object>,
 *   getCollection: (jwt: string) => Promise<Object>,
 *   sellCard: (jwt: string, cardId: string) => Promise<Object>,
 *   addCard: (jwt: string, cardData: Object) => Promise<Object>,
 *   getBooster: (jwt: string) => Promise<Object>,
 *    useBooster: (jwt: string) => Promise<Object>,
 *   buyBooster: (jwt: string, price: string | number) => Promise<Object>
 * }}
 */
const userFetchDAO = (fetch) => ({
    login: async (credentials) => {
        const url = new URL(`${urlBase}/user/login`)
        return doPost(url, credentials, fetch)
    },

    register: async (userData) => {
        const url = new URL(`${urlBase}/user/register`)
        return doPost(url, userData, fetch)
    },

    refreshTokens: async (jwt, refreshToken) => {
        const url = new URL(`${urlBase}/user/refresh-tokens`)
        return doAuthPost(url, refreshToken, null, fetch)
    },

    getUser: async (jwt) => {
        const url = new URL(`${urlBase}/user`)
        return doAuthGet(url, jwt, fetch)
    },

    updateUser: async (jwt, userData) => {
        const url = new URL(`${urlBase}/user`)
        return doAuthPut(url, jwt, userData, fetch)
    },

    deleteUser: async (jwt) => {
        const url = new URL(`${urlBase}/user`)
        return doAuthDelete(url, jwt, fetch)
    },

    updatePassword: async (jwt, passwordData) => {
        const url = new URL(`${urlBase}/user/password`)
        return doAuthPut(url, jwt, passwordData, fetch)
    },

    getCollection: async (jwt) => {
        const url = new URL(`${urlBase}/user/collection`)
        return doAuthGet(url, jwt, fetch)
    },

    sellCard: async (jwt, cardId) => {
        const url = new URL(`${urlBase}/user/sell-card/${cardId}`)
        return doAuthPut(url, jwt, null, fetch)
    },

    addCard: async (jwt, cardData) => {
        const url = new URL(`${urlBase}/addCard`)
        return doAuthPut(url, jwt, cardData, fetch)
    },

    getBooster: async (jwt) => {
        const url = new URL(`${urlBase}/booster`)
        return doAuthPut(url, jwt, null, fetch)
    },

    useBooster: async (jwt) => {
        const url = new URL(`${urlBase}/booster/use`)
        return doAuthPut(url, jwt, null, fetch)
    },

    buyBooster: async (jwt, price) => {
        const url = new URL(`${urlBase}/booster/buy/${price}`)
        return doAuthPut(url, jwt, null, fetch)
    },
})

/**
 * Helper to send a POST request.
 * 
 * @param {URL} url - The endpoint URL.
 * @param {Object} body - The JSON payload to send.
 * @param {typeof fetch} fetch - The fetch implementation.
 * @returns {Promise<Object>} The parsed JSON response.
 */
async function doPost(url, body, fetch) {
    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            agent: agent || undefined
        })
        return await handleResponse(response)
    } catch (err) {
        console.error('Error during POST:', err)
        throw err
    }
}

/**
 * Helper to send an authenticated GET request.
 * 
 * @param {URL} url - The endpoint URL.
 * @param {string} token - The Bearer token.
 * @param {typeof fetch} fetch - The fetch implementation.
 * @returns {Promise<Object>} The parsed JSON response.
 */
async function doAuthGet(url, token, fetch) {
    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            agent: agent || undefined
        })
        return await handleResponse(response)
    } catch (err) {
        console.error('Error during GET:', err)
        throw err
    }
}

/**
 * Helper to send an authenticated PUT request.
 * 
 * @param {URL} url - The endpoint URL.
 * @param {string} token - The Bearer token.
 * @param {Object|null} body - The JSON payload or null.
 * @param {typeof fetch} fetch - The fetch implementation.
 * @returns {Promise<Object>} The parsed JSON response.
 */
async function doAuthPut(url, token, body = null, fetch) {
    try {
        const response = await fetch(url.toString(), {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : null,
            agent: agent || undefined
        })
        return await handleResponse(response)
    } catch (err) {
        console.error('Error during PUT:', err)
        throw err
    }
}

/**
 * Helper to send an authenticated DELETE request.
 * 
 * @param {URL} url - The endpoint URL.
 * @param {string} token - The Bearer token.
 * @param {typeof fetch} fetch - The fetch implementation.
 * @returns {Promise<Object>} The parsed JSON response.
 */
async function doAuthDelete(url, token, fetch) {
    try {
        const response = await fetch(url.toString(), {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
            agent: agent || undefined
        })
        return await handleResponse(response)
    } catch (err) {
        console.error('Error during DELETE:', err)
        throw err
    }
}

/**
 * Parses and handles the HTTP response.
 * 
 * @param {Response} response - The fetch response object.
 * @returns {Promise<Object>} Parsed JSON data.
 * @throws Will throw an error if the response is not OK.
 */
async function handleResponse(response) {
    if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorBody}`)
    }
    const data = await response.json()
    return data
}

/**
 * Helper to send an authenticated POST request.
 * 
 * @param {URL} url - The endpoint URL.
 * @param {string} token - The Bearer token.
 * @param {Object|null} body - The JSON payload or null.
 * @param {typeof fetch} fetch - The fetch implementation.
 * @returns {Promise<Object>} The parsed JSON response.
 */
async function doAuthPost(url, token, body = null, fetch) {
    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : null,
            agent: agent || undefined
        })
        return await handleResponse(response)
    } catch (err) {
        console.error('Error during POST:', err)
        throw err
    }
}

export default userFetchDAO

