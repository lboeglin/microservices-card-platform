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

const resourceFetcherDao = {
    /**
     * Fetches a resource from `source`
     * @param {string} source Represents the URL to the source.
     * @param {string} api_param Represents the parameter for the API key.
     * @param {string} api_key Represents the API key to pass as parameter.
     * @returns The source's response data.
     */
    fetchOne: async (source, api_param = null, api_key = null) => {
        try {
            const url = new URL(source);
            if (api_param !== null)
                url.searchParams.append(api_param, api_key);

            const response = agent
                ? await fetch(url.toString(), { agent })
                : await fetch(url.toString());

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();
            return json;
        } catch (error) {
            console.error("Error fetching resources :", error);
            return [];
        }
    },

    /**
     * Fetches an `amount` of resources from `source`
     * @param {string} source Represents the URL to the source.
     * @param {string} number_param_name Represents the name of the GET parameter to set the amount of cards to fetch.
     * @param {number} amount The amount of cards to fetch.
     * @param {string} api_param Represents the parameter for the API key.
     * @param {string} api_key Represents the API key to pass as parameter.
     * @returns The source's response data.
     */
    fetchMany: async (source, amount_param, amount, api_param, api_key) => {
        try {
            const url = new URL(source);
            url.searchParams.append(amount_param, amount);
            if (api_param !== null)
                url.searchParams.append(api_param, api_key);

            const response = agent
                ? await fetch(url.toString(), { agent })
                : await fetch(url.toString());

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();
            return json;
        } catch (error) {
            console.error("Error fetching resources :", error);
            return [];
        }
    }
};

export default resourceFetcherDao;
