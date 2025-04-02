'use strict'

import express from 'express'
import userController from "../controller/userController.mjs";
import cardController from "../controller/cardController.mjs";

const userRoutes = express.Router()

userRoutes
    .route('/getAll')
    .get(async (req, res) =>{
        const data = await userController.getAll()
        res.status(200).send(data)
    })

userRoutes
    .route('/:id')
    .get(async (req, res) =>{
        const id = parseFloat(req.params.id)
        const data = await userController.getFromId(id)
        res.status(200).send(data)
    })

userRoutes
    .route('/login')
    .post(async (req, res) =>{
        await userController.login(req, res)
    })

userRoutes
    .route('/register')
    .post(async (req, res) =>{
        await userController.register(req, res)
    })

userRoutes
    .route('/:userId/openBooster/:type')
    .post(async (req, res) =>{
        // check if userId is valid (not really safe if someone manages to get your userId)
        const userId = parseFloat(req.params.userId)
        const user = await userController.getFromId(userId)
        if (!user) {
            res.status(404).send('User not found')
            return
        }

        if (!req.params.type) {
            const data = await cardController.getBooster(6, "")
            res.status(201).send(data)
        } else {
            const data = await cardController.getBooster(6, req.params.type)
            res.status(201).send(data)
        }
    })

userRoutes
    .route('/:userId/openSpecialBooster/:type')
    .post(async (req, res) =>{
        // check if userId is valid (not really safe if someone manages to get your userId)
        const userId = parseFloat(req.params.userId)
        const user = await userController.getFromId(userId)
        if (!user) {
            res.status(404).send('User not found')
            return
        }

        if (!req.params.type) {
            const data = await cardController.getSpecialBooster(6, "")
            res.status(201).send(data)
        } else {
            const data = await cardController.getSpecialBooster(6, req.params.type)
            res.status(201).send(data)
        }
    })

export default userRoutes