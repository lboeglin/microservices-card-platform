import fetch from 'node-fetch'
import HttpsProxyAgent from 'https-proxy-agent'

const proxy = process.env.https_proxy

let agent = null
if (proxy != undefined) {
    console.log(`Using proxy: ${proxy}`)
    agent = new HttpsProxyAgent(proxy)
}
else {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    console.log('Not using proxy')
}

const urlBase = process.env.CARD_SERVICE_URL

const cardFetchDAO = {
    findOne : async (id) => {
        try {
            const url = new URL(urlBase+'/card-info')
            url.searchParams.append('id', id)

            const response = agent
                ? await fetch(url.toString(), { agent })
                : await fetch(url.toString())
            
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching card data:', error)
            throw error
        }
    },
    findCollection : async (collectionIds) => {
        try {
            const url = new URL(urlBase+'/collection-info')

            const response = await fetch(url.toString(), {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json',  
                },
                body: JSON.stringify({ collection: collectionIds })  
            })

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching card data:', error)
            throw error
        }
        
    },
    findMany : async (number) => {
        try {
            const url = new URL(urlBase+'/get-cards')
            url.searchParams.append('num', number)

            const response = agent
                ? await fetch(url.toString(), { agent })
                : await fetch(url.toString())
            
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching card data:', error)
            throw error
        }
    }
}
export default cardFetchDAO
    