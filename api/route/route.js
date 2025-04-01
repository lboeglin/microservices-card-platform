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


export default router
