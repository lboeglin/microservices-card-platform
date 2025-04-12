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
        const { name, password } = req.body
        try {
            const user = await userController.loginUser(name, password)
            if (!user) {
                return res.status(401).send({ message: "Invalid credentials" })
            }
            const accessToken = generateAccessToken({ name: name });
            const refreshToken = generateRefreshToken({ name: name });
            
            res.status(200).json({ accessToken, refreshToken })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

// Create a new user
router
    .route('/user/register')
    .post(async (req, res) => {
        const { name, password } = req.body
        if (!name || !password) {
            return res.status(400).send({ message: "Username and password are required" })
        }
        try {
            const user = await userController.register(name, password)
            if (user != null) {
                return res.status(201).send({ message: `User created` })
            }
            res.status(409).send({ message: "Username already taken or failed to register" })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

// Send a new access token
router
    .route('/user/refresh-tokens')
    .post(authenticateRefreshToken, async (req, res) => {
        try {

            const newAccessToken = req.newAccessToken
            const newRefreshToken = req.newRefreshToken
            
            res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

// Get info from user (not sure if need cuz only send back collection and boosters)
// DELETE a user from it's name (not sure if need password to delete cuz annoying when we can just make a r u sure button)
// UPDATE a user name (send back user info/tokens)
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
            const name = extractNameFromToken(req)
            const {newName} = req.body
            if (!newName || newName.trim() === "") {
                return res.status(400).send({message: "A new valide name is required" })
            }
            const user = await userController.getUserByName(newName)
            if (user != null) {
                return res.status(409).send({ message: "UUsername already taken" })
            }
            const newUser = await userController.updateName(name, newName)
            if (newUser) {
                const newAccessToken = generateAccessToken({ name: newName })
                const newRefreshToken = generateRefreshToken({ name: newName })
    
                return res.status(200).send({ user: newUser, accessToken: newAccessToken, refreshToken: newRefreshToken })
            }
            res.status(400).send({ message: `Failed to update name ${newUser}` })
        } catch (error) {
            res.status(500).send({ message: error.message })
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
            res.status(500).send({ message: error.message })
        }
    })

// Called when going to gacha page (on client side so not sure if this function should be here) 
// Return number of free booster owned
router
    .route('/booster')
    .put(async (req, res) => {
        try {
            const name = extractNameFromToken(req)
            const user = await userController.getUserByName(name)
            if (!user) {
                return res.status(404).send({ message: "User not found" })
            }
            const boosters = user.boosters
            
            let lastBooster = null
            if (boosters.length > 0) {
                lastBooster = boosters[0]
            } else {
                lastBooster = user.lastBooster
            }
        
            const currentTime = Date.now()
            const twelveHours = 12 * 60 * 60 * 1000

            if (lastBooster) {
                const timeDifference = currentTime - lastBooster
                let numberOfBooster = boosters.length
                if (timeDifference >= twelveHours && numberOfBooster < 2) {
                    numberOfBooster = await userController.claimBooster(name, currentTime)
                }
                return res.status(200).send(numberOfBooster)
            }
            
            return res.status(400).send({ message: "Failed to check boosters available" }) 

        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

// Use one of the free booster inside the inventory if have any
router
    .route("/booster/use")
    .put(async (req, res) => {
        try {
            const name = extractNameFromToken(req)
            const user = await userController.getUserByName(name)
            if (!user) {
                return res.status(400).send({ message: "User not found" })
            }

            if (user.boosters.length < 1) {
                return res.status(400).send({ message: "No booster ready to be oponed "})
            }

            const result = await userController.useBooster(name)
            if (result != null) {
                return res.status(200).send({ message: "Booster opened" })
            }
            res.status(400).send({ message: "Failed to open booster" })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

// Buy a booster at a set price 
router
    .route("/booster/buy/:price")
    .put(async (req, res) => {
        try {
            const name = extractNameFromToken(req)
            const user = await userController.getUserByName(name)
            if (!user) {
                return res.status(400).send({ message: "User not found" })
            }

            const price = req.params.price || 1
            if (user.coins < price) {
                return res.status(400).send({ message: "The user does not have enough coins" })
            }

            const result = await userController.buyBooster(name, price)
            if (result != null) {
                return res.status(200).send({ message: "Booster bought successfully" })
            }
            res.status(400).send({ message: "Failled to buy a booster" })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })
export default router
