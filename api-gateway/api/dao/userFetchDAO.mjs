import HttpsProxyAgent from 'https-proxy-agent'
import dotenv from 'dotenv'
dotenv.config()

const proxy = process.env.https_proxy

let agent = null
if (proxy !== undefined) {
    console.log(`Using proxy: ${proxy}`)
    agent = new HttpsProxyAgent(proxy)
} else {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    console.log('Not using proxy')
}

const urlBase = process.env.USER_SERVICE_URL + "/user-api"

const userFetchDAO = (fetch) => ({
    login: async (credentials) => {
        const url = new URL(`${urlBase}/user/login`)
        return doPost(url, credentials, fetch)
    },

    register: async (userData) => {
        const url = new URL(`${urlBase}/user/register`)
        return doPost(url, userData, fetch)
    },

    refreshTokens: async (refreshTokenData) => {
        const url = new URL(`${urlBase}/user/refresh-tokens`)
        return doPost(url, refreshTokenData, fetch)
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

// Helper functions
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

async function handleResponse(response) {
    if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorBody}`)
    }
    const data = await response.json()
    return data
}

export default userFetchDAO

// trying register hard coded here but should be in a test file
const testRegister = async () => {
    try {
        const newUser = {
            name: 'samueiojdfsqijosqdoijdsqldsqqsjo',
            password: 'supersecurepassword'
        }

        const result = await userFetchDAO.register(newUser)
        console.log('Register success:', result)

        const loginResult = await userFetchDAO.login({
            name: newUser.name,
            password: newUser.password
        })
        console.log('Login result:', loginResult)

        const jwt = loginResult.accessToken
        console.log('JWT:', jwt)
        const userInfo = await userFetchDAO.getUser(jwt)
        console.log('User info:', userInfo)

    } catch (err) {
        console.error('Register failed:', err.message)
    }
}
