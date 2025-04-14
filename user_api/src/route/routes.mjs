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

router
    .route('/user/login')
    .post(async (req, res) => {
        /*
        #swagger.summary = 'Login user and return access/refresh tokens'
        #swagger.description = 'Authenticates a user and returns JWT access and refresh tokens.'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                name: 'string',
                password: 'string'
            }
        }
        */
        try {
            const { name, password } = req.body
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

router
    .route('/user/register')
    .post(async (req, res) => {
        /*
        #swagger.summary = 'Register a new user'
        #swagger.description = 'Creates a new user if the username is not already taken.'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                name: 'string',
                password: 'string'
            }
        }
        */
        try {
            const { name, password } = req.body
            if (!name || !password) {
                return res.status(400).send({ message: "Username and password are required" })
            }
            const user = await userController.register(name, password)
            if (user != null) {
                return res.status(201).send({ message: `User created` })
            }
            res.status(409).send({ message: "Username already taken or failed to register" })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

router
    .route('/user/refresh-tokens')
    .post(authenticateRefreshToken, async (req, res) => {
        /*
        #swagger.summary = 'Refresh access and refresh tokens'
        #swagger.description = 'Uses a valid refresh token to issue new access and refresh tokens.'
        */
        try {
            const newAccessToken = req.newAccessToken
            const newRefreshToken = req.newRefreshToken

            res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

router
    .route('/user')
    .get(async (req, res) => {
        /*
        #swagger.summary = 'Get current user information'
        #swagger.description = 'Returns user information extracted from the JWT token.'
        */
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
        /*
        #swagger.summary = 'Delete the current user'
        #swagger.description = 'Deletes the authenticated user based on the JWT token.'
        */
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
        /*
        #swagger.summary = 'Update username'
        #swagger.description = 'Updates the authenticated user's name and returns new tokens.'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                newName: 'string'
            }
        }
        */
        try {
            const name = extractNameFromToken(req)
            const { newName } = req.body
            if (!newName || newName.trim() === "") {
                return res.status(400).send({ message: "A new valide name is required" })
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

router
    .route('/user/password')
    .put(async (req, res) => {
        /*
        #swagger.summary = 'Update user password'
        #swagger.description = 'Updates the user's password given the current one.'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                currentPassword: 'string',
                newPassword: 'string'
            }
        }
        */
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

router
    .route('/user/collection')
    .get(async (req, res) => {
        /*
        #swagger.summary = 'Get card collection'
        #swagger.description = 'Returns an array of card IDs owned by the authenticated user.'
        */
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

router
    .route('/user/sell-card/:id')
    .put(async (req, res) => {
        /*
        #swagger.summary = 'Sell a card from the collection'
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'integer',
            description: 'ID of the card to sell'
        }
        #swagger.description = 'Removes a card from the collection and adds coins to the user.'
        */
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

router
    .route("/addCard")
    .put(async (req, res) => {
         /*
        #swagger.summary = 'Add cards to the user's collection'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                cards: [1, 2, 3]
            }
        }
        #swagger.description = 'Adds one or more card IDs to the user's collection.'
        */
        try {
            const name = extractNameFromToken(req)
            const user = await userController.getUserByName(name)
            if (!user) {
                return res.status(400).send({ message: "User not found" })
            }
            const { cards } = req.body
            const result = await userController.addCards(name, cards)
            if (result) {
                return res.status(200).send({ message: "Cards added" })
            }
            res.status(400).send({ message: "Could not add cards" })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

router
    .route('/booster')
    .put(async (req, res) => {
        /*
        #swagger.summary = 'Check free boosters availability'
        #swagger.description = 'Checks if the user can claim a free booster based on time elapsed.'
        */
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

router
    .route("/booster/use")
    .put(async (req, res) => {
        /*
        #swagger.summary = 'Use a booster'
        #swagger.description = 'Uses one of the free boosters if available and returns result.'
        */
        try {
            const name = extractNameFromToken(req)
            const user = await userController.getUserByName(name)
            if (!user) {
                return res.status(400).send({ message: "User not found" })
            }

            if (user.boosters.length < 1) {
                return res.status(400).send({ message: "No booster ready to be oponed " })
            }

            const result = await userController.useBooster(name)
            if (result != null) {
                return res.status(200).send(result)
            }
            res.status(400).send({ message: "Failed to open booster" })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    })

router
    .route("/booster/buy/:price")
    .put(async (req, res) => {
        /*
        #swagger.summary = 'Buy a booster'
        #swagger.parameters['price'] = {
            in: 'path',
            required: false,
            type: 'integer',
            description: 'Price of the booster to purchase'
        }
        #swagger.description = 'Buys a booster using the user\'s coins.'
        */
        try {
            const name = extractNameFromToken(req)
            const user = await userController.getUserByName(name)
            if (!user) {
                return res.status(400).send({ message: "User not found" })
            }
            if (user.coins <= 0) {
                return res.status(400).send({ message: "Coins cannot be 0 or less" })
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
