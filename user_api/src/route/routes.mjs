'use strict'

import express from 'express'
import userController from "../controller/userController.mjs";
import boosterController from "../controller.boosterController.mjs"
import {
    extractNameFromToken,
    authenticateRefreshToken,
    generateAccessToken,
    generateRefreshToken
} from '../middleware/jwtAuth.mjs'

const router = express.Router()

// Login user and send back tokens
router
    .route('/user/login')
    .post(async (req, res) => {
        const { username, password } = req.body
        try {
            const user = await userController.loginUser(username, password)
            if (!user) {
                return res.status(401).send({ message: "Invalid credentials" })
            }
            const accessToken = generateAccessToken({ name: user.name })
            const refreshToken = generateRefreshToken({ name: user.name })
            res.status(200).json({ accessToken, refreshToken })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

// Create a new user
router
    .route('/user/register')
    .post(async (req, res) => {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).send({ message: "Username and password are required" })
        }
        try {
            const user = await userController.register({ username, password })
            if (user != null) {
                return res.status(201).send({ message: "User created" })
            }
            res.status(409).send({ message: "Username already taken" })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

// Send a new access token
router
    .route('/user/refresh-tokens')
    .post(authenticateRefreshToken, async (req, res) => {
        const newAccessToken = generateAccessToken({ name: req.user.name });
        const newRefreshToken = generateRefreshToken({ name: req.user.name });

        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    })

// Get info from user (not sure if need cuz only send back collection and boosters)
// DELETE a user from it's name (not sure if need password to delete cuz annoying when we can just make a r u sure button)
// UPDATE username/password (not sure if we make a separate route)
router
    .route('/user')
    .get(async (req, res) => {
        try {
            const name = extractNameFromToken(req)
            const user = await userController.getUserByName(name)
            if (user) {
                return res.status(200).send(user)
            }
            res.status(404).send({ message: "User not found" })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })
    .delete(async (req, res) => {
        try {
            const name = extractNameFromToken(req)
            const result = await userController.deleteUser(name)
            if (result) {
                return res.status(200).send({ message: "User deleted" })
            }
            res.status(400).send({ message: "Failed to delete user" })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })
    .put(async (req, res) => {
        try {

        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

// Send back array of card ids
router
    .route('/user/collection')
    .get(async (req, res) => {
        try {
            const name = extractNameFromToken(req)
            const collection = await userController.getCollection(name)
            if (collection != null) {
                return res.status(200).send(collection)
            }
            res.status(404).send({ message: "Collection not found" })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

// Send an id of card from the collection and remove it than adding money to the account
router
    .route('/user/sell-card/:id')
    .put(async (req, res) => {
        try {
            const username = extractNameFromToken(req)
            const cardId = req.params.id
            const result = await userController.sellCard(username, cardId)
            if (result) {
                return res.status(200).send({ message: "Card sold successfully" })
            }
            res.status(400).send({ message: "Could not sell card" })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

// Called when going to gacha page (on client side so not sure if this function should be here)
router
    .route('/booster/claim-booster')
    .post(async (req, res) => {
        try {
            const name = extractNameFromToken(req)
            const user = await userController.getUserByName(name)
            if (!user) {
                return res.status(404).send({ message: 'User not found' })
            }

            const lastBooster = user.boosters // TODO : logic to get the latest one

            const currentTime = Date.now()
            const twelveHours = 12 * 60 * 60 * 1000

            if (lastBooster) {
                const timeDifference = currentTime - lastBooster
                if (timeDifference < twelveHours) {
                    const remainingTime = twelveHours - timeDifference
                    return res.status(400).send({message : "Need to wait x time"}) // Use remaining time
                }
            }

            await userController.addBooster({name,currentTime})

            return res.status(200).send({ message: 'Free booster claimed successfully' })

        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

export default router
