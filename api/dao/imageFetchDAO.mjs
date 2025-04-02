"use strict";

import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';
import dotenv from 'dotenv';
import Card from '../models/card.mjs';
dotenv.config();

const proxy = process.env.https_proxy;

if (proxy != null) {
    console.log(`Using proxy: ${proxy}`);
    agent = new HttpsProxyAgent(proxy);
}else {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log(`No proxy set`);
}

const apiKey = "process.env.API_KEY";
const urlBase = "process.env.URL_BASE";

const imageFetchDAO = {
    findOne : async()=>{
        let response = agent!=null ? await fetch(urlBase+apiKey, {agent: agent}) : await fetch(urlBase+apiKey);
        let json = await response.json();

        const data = json.results;

        return data;

    }

}