'use strict'

import express from 'express'
import userController from '../controller/controller.mjs'
import fetch from 'node-fetch'

const userRouter = express.Router()

const getJwtFromRequest = (req) => req.headers['authorization']?.split(' ')[1]

// ------------------------
// Public Routes
// ------------------------

userRouter
  .route('/login')
  .post(async (req, res) => {
    /*
    #swagger.sumary = 'Login user and return JWT'
    #swagger.description = 'Authenticate user and return JWT for further requests'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: 'User credentials',
      schema: {
          name: { type: 'string', example: 'user1' },
          password: { type: 'string', example: 'password123' }
        }
    }
    #swagger.responses[200] = {
      description: 'User authenticated successfully',
      schema: {
          token: { type: 'string', example: 'jwt-token' }
        }
    }
    #swagger.responses[400] = {
      description: 'User authentication failed',
      schema: {
          message: { type: 'string', example: 'Invalid credentials' }
        }
    }
    */
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
    /*
    #swagger.sumary = 'Register user and return message'
    #swagger.description = 'Register a new user and return a success message if the username is available'
    #swagger.parameters['body'] = {
      in : 'body',
      required: true,
      description: 'User registration details',
      schema: {
          name: { type: 'string', example: 'user1' },
          password: { type: 'string', example: 'password123' }
        }
    }
    #swagger.responses[201] = {
      description: 'User registered successfully',
      schema: {
          message: { type: 'string', example: 'User registered successfully' }
        }
    }
    #swagger.responses[400] = {
      description: 'User registration failed',
      schema: {
          message: { type: 'string', example: 'User already exists' }
        }
    }
    */
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
    /*
    #swagger.sumary = 'Refresh JWT tokens'
    #swagger.description = 'Refresh JWT tokens using refresh token'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: 'Refresh token',
      schema: {
          refreshToken: { type: 'string', example: 'refresh-token' }
        }
    }
    #swagger.responses[200] = {
      description: 'Tokens refreshed successfully',
      schema: {
          token: { type: 'string', example: 'new-jwt-token' },
          refreshToken: { type: 'string', example: 'new-refresh-token' }
        }
    }
    #swagger.responses[400] = {
      description: 'Token refresh failed',
      schema: {
          message: { type: 'string', example: 'Invalid refresh token' }
        }
    }
    */
    try {
      const result = await userController.refreshTokens(req.headers['authorization'].split(' ')[1])
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

// ------------------------
// Auth-protected Routes
// ------------------------

userRouter
  .route('/')
  .get(async (req, res) => {
    /*
    #swagger.sumary = 'Get user details'
    #swagger.description = 'Get user details using JWT'
    #swagger.responses[200] = {
      description: 'User details retrieved successfully',
      schema: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'user1' },
          collection: { type: 'array', items: { type: 'object' } }
        }
    }
    #swagger.responses[400] = {
      description: 'Failed to retrieve user details',
      schema: {
          message: { type: 'string', example: 'Invalid JWT' }
        }
    }
    */
    try {
      const jwt = getJwtFromRequest(req)
      const result = await userController.getUser(jwt)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })
  .put(async (req, res) => {
    /*
    #swagger.sumary = 'Update user details'
    #swagger.description = 'Update user details using JWT'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: 'User details to update',
      schema: {
          name: { type: 'string', example: 'newUserName' },
          password: { type: 'string', example: 'newPassword' }
        }
    }
    #swagger.responses[200] = {
      description: 'User details updated successfully',
      schema: {
          message: { type: 'string', example: 'User updated successfully' }
        }
    }
    #swagger.responses[400] = {
      description: 'Failed to update user details',
      schema: {
          message: { type: 'string', example: 'Invalid JWT' }
        }
    }
    */
    try {
      const jwt = getJwtFromRequest(req)
      const result = await userController.updateUser(jwt, req.body)
      res.status(200).json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })
  .delete(async (req, res) => {
    /*
    #swagger.sumary = 'Delete user'
    #swagger.description = 'Delete user using JWT'
    #swagger.responses[200] = {
      description: 'User deleted successfully',
      schema: {
          message: { type: 'string', example: 'User deleted successfully' }
        }
    }
    #swagger.responses[400] = {
      description: 'Failed to delete user',
      schema: {
          message: { type: 'string', example: 'Invalid JWT' }
        }
    }
    */
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
    /*
    #swagger.sumary = 'Update user password'
    #swagger.description = 'Update user password using JWT'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: 'New password details',
      schema: {
          currentPassword: { type: 'string', example: 'oldPassword' },
          newPassword: { type: 'string', example: 'newPassword' }
        }
    }
    #swagger.responses[200] = {
      description: 'User password updated successfully',
      schema: {
          message: { type: 'string', example: 'Password updated successfully' }
        }
    }
    #swagger.responses[400] = {
      description: 'Failed to update password',
      schema: {
          message: { type: 'string', example: 'Invalid JWT' }
        }
    }
    */
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
    /*
    #swagger.sumary = 'Get user collection'
    #swagger.description = 'Get user collection using JWT'
    #swagger.responses[200] = {
      description: 'User collection retrieved successfully',
      schema: {
          collection: { type: 'array', items: { type: 'object' } }
        }
    }
    #swagger.responses[400] = {
      description: 'Failed to retrieve user collection',
      schema: {
          message: { type: 'string', example: 'Invalid JWT' }
        }
    }
    */
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
    /*
    #swagger.sumary = 'Sell card'
    #swagger.description = 'Sell a card using JWT'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      description: 'Card ID to sell',
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: 'Card sold successfully',
      schema: {
          message: { type: 'string', example: 'Card sold successfully' }
        }
    }
    #swagger.responses[400] = {
      description: 'Failed to sell card',
      schema: {
          message: { type: 'string', example: 'Invalid JWT' }
        }
    }
    */
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
    /*
    #swagger.sumary = 'Get booster'
    #swagger.description = 'Get booster using JWT'
    #swagger.responses[200] = {
      description: 'Booster retrieved successfully',
      schema: {
          booster: { type: 'object' }
        }
    }
    #swagger.responses[400] = {
      description: 'Failed to retrieve booster',
      schema: {
          message: { type: 'string', example: 'Invalid JWT' }
        }
    }
    */
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
    /*
    #swagger.sumary = 'Use booster'
    #swagger.description = 'Use booster using JWT'
    #swagger.responses[200] = {
      description: 'Booster used successfully',
      schema: {
          cards: { type: 'array', items: { type: 'object' } }
        }
    }
    #swagger.responses[400] = {
      description: 'Failed to use booster',
      schema: {
          message: { type: 'string', example: 'Invalid JWT' }
        }
    }
    */
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
  /*
  #swagger.sumary = 'Buy booster'
  #swagger.description = 'Buy a booster using JWT'
  #swagger.parameters['price'] = {
    in: 'path',
    required: true,
    description: 'Price of the booster',
    type: 'integer'
  }
  #swagger.responses[200] = {
    description: 'Booster bought successfully',
    schema: {
        message: { type: 'string', example: 'Booster bought successfully' }
      }
  }
  #swagger.responses[400] = {
    description: 'Failed to buy booster',
    schema: {
        message: { type: 'string', example: 'Invalid JWT' }
      }
  }
  */
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
