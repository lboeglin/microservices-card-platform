'use strict'

import express from 'express'
import userController from '../controller/controller.mjs'
import fetch from 'node-fetch'

const userRouter = express.Router()

const getJwtFromRequest = (req) => req.headers['authorization']?.split(' ')[1]

// ------------------------
// 🚪 Public Routes
// ------------------------

userRouter
  .route('/login')
  .post(async (req, res) => {
    try {
      const result = await userController.login(req.body)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

userRouter
  .route('/register')
  .post(async (req, res) => {
    try {
      const result = await userController.register(req.body)
      res.status(201).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

userRouter
  .route('/refresh-tokens')
  .post(async (req, res) => {
    try {
      const result = await userController.refreshTokens(req.body)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

// ------------------------
// 🔐 Auth-protected Routes
// ------------------------

userRouter
  .route('/')
  .get(async (req, res) => {
    try {
      const jwt = getJwtFromRequest(req)
      const result = await userController.getUser(jwt)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })
  .put(async (req, res) => {
    try {
      const jwt = getJwtFromRequest(req)
      const result = await userController.updateUser(jwt, req.body)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const jwt = getJwtFromRequest(req)
      const result = await userController.deleteUser(jwt)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

userRouter
  .route('/password')
  .put(async (req, res) => {
    try {
      const jwt = getJwtFromRequest(req)
      const result = await userController.updatePassword(jwt, req.body)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

userRouter
  .route('/collection')
  .get(async (req, res) => {
    try {
      const jwt = getJwtFromRequest(req)
      const result = await userController.getCollection(jwt)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

userRouter
  .route('/sell-card/:id')
  .put(async (req, res) => {
    try {
      const jwt = getJwtFromRequest(req)
      const result = await userController.sellCard(jwt, req.params.id)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

userRouter
  .route('/booster')
  .put(async (req, res) => {
    try {
      const jwt = getJwtFromRequest(req)
      const result = await userController.getBooster(jwt)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

userRouter
  .route('/booster/use')
  .put(async (req, res) => {
    try {
      const jwt = getJwtFromRequest(req)
      const result = await userController.useBooster(jwt)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

userRouter
  .route('/booster/buy/:price')
  .put(async (req, res) => {
    try {
      const jwt = getJwtFromRequest(req)
      const result = await userController.buyBooster(jwt, req.params.price)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

export default userRouter
