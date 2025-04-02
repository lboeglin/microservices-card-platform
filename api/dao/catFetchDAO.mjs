"use strict";

import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';
import dotenv from 'dotenv';
dotenv.config();

const proxy = process.env.HTTPS_PROXY;

let agent = null;
if (proxy) {
    console.log(`Using proxy: ${proxy}`);
    agent = new HttpsProxyAgent(proxy);
} else {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log(`No proxy set`);
}

const apiKey = process.env.API_KEY;
const urlBase = process.env.URL_BASE;

const catFetchDAO = {
    findOne: async () => {
        try {
            const url = new URL(urlBase);
            url.searchParams.append("api_key", apiKey);
            
            const response = agent 
                ? await fetch(url.toString(), { agent }) 
                : await fetch(url.toString());
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();
            return json;
        } catch (error) {
            console.error("Error fetching images:", error);
            return [];
        }
    }
};

export default catFetchDAO;

