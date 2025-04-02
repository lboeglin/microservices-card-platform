'use strict'

import express from 'express'
import cardController from "../controller/cardController.mjs";

const boosterRoutes = express.Router()

boosterRoutes
    .route('/getAvailable')
    .get(async (req, res) =>{
        const data = await cardController.getAvailableBooster()
        res.status(200).send(data)
    })

export default boosterRoutes;