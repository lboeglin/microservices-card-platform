'use strict'

import express from 'express'
import userRouter from './userRoute.mjs'
import authMiddleware from '../middleware/auth.mjs'

const router = express.Router()

// --------------------
// Global Middleware for JWT verification (skip for certain public routes)
// --------------------
router.use('/user', (req, res, next) => {
    // Skip JWT verification for login, register, and refresh-tokens
    if (req.path === '/login' || req.path === '/register' || req.path === '/refresh-tokens') {
        return next()
    }
    // Apply JWT verification for all other routes
    authMiddleware(req, res, next)
})

// Use the user and card routers
router.use('/user', userRouter)

export default router
