'use strict'

import express from 'express'
import userController from "../controller/userController.mjs";
import { authenticateToken, generateToken } from '../middleware/jwtAuth.mjs'

const userRoutes = express.Router()


// DELETE ?
userRoutes
    .route('/user/info')
    .get(authenticateToken, async (req, res) =>{
        // TODO
    })
    .delete(async (req, res) => {
        // TODO
    })

userRoutes
    .route('/user/login')
    .post(async (req, res) =>{
        const { username, password } = req.body
        const user = null // TODO : userController....
        if (!user) {
            return res.status(401).send({message : "Invalid credentials"})
        }
        const token = generateToken({ id: user.id, username: user.username })
        res.status(200).json({ token })
    })

userRoutes
    .route('/user/register')
    .post(async (req, res) =>{
        // TODO
    })
   

userRoutes
    .route('user/coin')
    .put(authenticateToken, async (req, res) => {
        // TODO
    })

// Maybe do a page system ?
userRoutes
    .route('user/collection')
    .get(authenticateToken, async (req, res) => {
        // TODO
    })

userRoutes
    .route('user/sell-card/:id')
    .put(authenticateToken, async (req, res) => {
        // TODO
    })

export default userRoutes