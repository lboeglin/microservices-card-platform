'use strict'

import express from 'express'
import userController from "../controller/userController.mjs";
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
            const accessToken = req.newAccessToken
            const refreshToken = req.newRefreshToken
            res.status(200).json({ accessToken, refreshToken })
        } catch (error) {
            res.status(500).send({ message: error })
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
            res.status(500).send({ message: error })
        }
    })

// Send a new access token
router
    .route('/user/refresh-tokens')
    .post(authenticateRefreshToken, async (req, res) => {
        try {

            const newAccessToken = generateAccessToken({ name: req.user.name });
            const newRefreshToken = generateRefreshToken({ name: req.user.name });
            
            res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (error) {
            res.status(500).send({ message: error })
        }
    })

// Get info from user (not sure if need cuz only send back collection and boosters)
// DELETE a user from it's name (not sure if need password to delete cuz annoying when we can just make a r u sure button)
// UPDATE a user name (send back user info)
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
            res.status(500).send({ message: error })
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
            res.status(500).send({ message: error })
        }
    })
    .put(async (req, res) => {
        try {
            const name = extractNameFromToken(req)
            const {newName} = req.body
            if (!newName || newName.trim() === "") {
                return res.status(400).send({message: "A new valide name is required"})
            }
            const user = await userController.getUserByName(newName)
            if (user != null) {
                return res.status(409).send({ message: "UUsername already taken"})
            }
            const newUser = await userController.updateName(name, newName)
            if (newUser) {
                return res.status(200).send(newUser)
            }
            res.status(400).send({ message: "Failed to update name" })
        } catch (error) {
            res.status(500).send({ message: error })
        }
    })

// Update user password
router
    .route('/user/password')
    .put(async (req, res) => {
        try {
            const name = extractNameFromToken(req)
            const { currentPassword, newPassword } = req.body
            
            const result = await userController.updatePassword(name, currentPassword, newPassword)
            if (result) {
                return res.status(200).send({ message: "Password updated" })
            }
            res.status(400).send({ message: "Failed to update password" })
        } catch (error) {
            res.status(500).send({ message: error })
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
            res.status(500).send({ message: error })
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
            res.status(500).send({ message: error })
        }
    })

// Called when going to gacha page (on client side so not sure if this function should be here) 
// Return number of free booster
router
    .route('/booster')
    .post(async (req, res) => {
        try {
            const name = extractNameFromToken(req)
            const user = await userController.getUserByName(name)
            if (!user) {
                return res.status(404).send({ message: "User not found" })
            }
            const boosters = user.boosters
            
            let lastBooster = null
            if (boosters.length == 2) {
                lastBooster =  Math.min(...boosters)
            } else if (boosters.length == 1) {
                lastBooster = boosters[0]
            } else {
                lastBooster = user.lastBooster
            }
        
            const currentTime = Date.now()
            const twelveHours = 12 * 60 * 60 * 1000

            if (lastBooster) {
                const timeDifference = currentTime - lastBooster
                let numberOfBooster = boosters.length
                if (timeDifference >= twelveHours) {
                    numberOfBooster = await userController.claimBooster(name, currentTime)
                }
                return res.status(200).send(numberOfBooster)
            }
            
            return res.status(400).send({ message: "Failed to check boosters available" }) 

        } catch (error) {
            res.status(500).send({ message: error })
        }
    })

// Add an array of cards to collection
router
    .route("/addCard")
    .put(async (req, res) => {
        try {
            const name = extractNameFromToken(req)
            const user = await userController.getUserByName(name)
            if (!user) {
                return res.status(400).send({ message: "User not found" })
            }
            const {cards} = req.body
            const result = await userController.addCards(name, cards)
            if (result) {
                return res.status(200).send({ message: "Cards added" })
            }
            res.status(400).send({ message: "Could not add cards" })
        } catch (error) {
            res.status(500).send({ message: error })
        }
    })

export default router
