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
    .route('/test')
    .get((req, res) => {
        res.status(200).send('Hello World!')
    })




export default router
