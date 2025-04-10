'use strict'
import express from 'express'
import userRouter from './userRoute.mjs'
import cardRouter from './cardRoute.mjs'

const router = express.Router()

router.use('/user', userRouter)
router.use('/card', cardRouter)
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the API Gateway'
    })
})

export default router