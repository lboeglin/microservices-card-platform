"use strict"
import express from 'express'
import cardController from "../controller/cardController";
import userController from "../controller/userController";

const router = express.Router()

// Test route

router
    .route('/test')
    .get((req, res) => {
        res.status(200).send('Hello World!')
    })

// Cards

router
    .route('/cards')
    .get(async (req, res) =>{
        const data = await cardController.getAll()
        res.status(200).send(data)
    })

router
    .route('/card/:id')
    .get(async (req, res) =>{
        const id = parseFloat(req.params.id)
        const data = await cardController.getFromId(id)
        res.status(200).send(data)
    })

// Users

router
    .route('/users')
    .get(async (req, res) =>{
        const data = await userController.getAll()
        res.status(200).send(data)
    })

router
    .route('/user/:id')
    .get(async (req, res) =>{
        const id = parseFloat(req.params.id)
        const data = await userController.getFromId(id)
        res.status(200).send(data)
    })

router
    .route('/login')
    .post(async (req, res) =>{
        await userController.login(req, res)
    })

router
    .route('/register')
    .post(async (req, res) =>{
        await userController.register(req, res)
    })

router
    .route('/:userId/openBooster/:type')
    .post(async (req, res) =>{
        // check if userId is valid (not realy safe if someone manages to get your userId)
        const userId = parseFloat(req.params.userId)
        const user = await userController.getFromId(userId)
        if (!user) {
            res.status(404).send('User not found')
            return
        }

        if (!req.params.type) {
            const data = await cardController.getXRandom(6)
            res.status(201).send(data)
        } else {
            const data = await cardController.getXRandomByType(6, req.params.type)
            res.status(201).send(data)
        }
    })



export default router
