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

const url = process.env.USER_SERVICE_URL

const userFetchDAO = {
    findOne : async (id) 
}