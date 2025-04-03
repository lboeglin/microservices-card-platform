"use strict"
import express from 'express'
import userRoutes from "./userRoute.mjs";
import cardRoutes from './cardRoute.mjs'
import boosterRoutes from "./boosterRoute.mjs";

const router = express.Router()

router.use('/user', userRoutes)
router.use('/card', cardRoutes)
router.use('/booster', boosterRoutes)

// Test route
router
    .route('/')
    .get((req, res) => {
        res.status(200).send('THE GACHA API IS ONLINE')
    })

export default router
