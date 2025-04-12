"use strict";

import { mongoose } from "mongoose";
import { User } from "../model/user.mjs";
import { hashPassword, verifyPassword } from "../utils/hashing.mjs";
import crypto from "crypto";
import { Int32 } from "mongodb";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String, // Salt for hashing
    required: true,
  },
  coins: {
    type: Number,
    required: true,
    min: 0,
  },
  collection: {
    type: [Int32],
    required: true,
    default: [],
  },
  boosters: {
    type: [Number],
    required: true,
    default: [],
  },
  lastBooster: {
    type: Number,
    required: true,
    default: Date.now(), // Not sure about this one
  },
});

const projection = { _id: 0, __v: 0 };

const adapter = (mongooseUser) => {
  if (!mongooseUser) {
    return null
  }
  mongooseUser = mongooseUser.toJSON()
  return new User(mongooseUser)
}

const MongoUser = mongoose.model("User", userSchema);

const userDAO = {
  getUserByName: async (name) => {
    try {
      const user = await MongoUser.findOne({ name: name }, projection)
      if (!user) {
        return null
      }
      
      return adapter(user)
    } catch (error) {
      throw error
    }
  },

  createUser: async (user) => {
    try {
      if (!user.name || !user.password) {
        return null
      }

      const res = await userDAO.getUserByName(user.name)
      if (res != null) {
        return null
      }

      const salt = crypto.randomBytes(128).toString("base64")
      const hashedPassword = await hashPassword(user.password, salt)

      user.salt = salt
      user.password = hashedPassword
      const newUser = new MongoUser(user)
      await newUser.save()

      return await userDAO.getUserByName(user.name)
    } catch (error) {
      throw error
    }
  },

  loginUser: async (name, password) => {
    try {
      const user = await userDAO.getUserByName(name)
      if (!user) {
        return null
      }

      const correct = await verifyPassword(user.password, password, user.salt)
      return correct ? user : null
    } catch (error) {
      throw error
    }
  },

  deleteUserByName: async (name) => {
    try {
      const user = await userDAO.getUserByName(name)
      if (!user) {
        return false
      }

      await MongoUser.deleteOne({ name: name })
      return true
    } catch (error) {
      throw error
    }
  },

  updateUserName: async ({ name, newName }) => {
    try {
        const user = await userDAO.getUserByName(name)
        if (!user) {
            return null
        }

        const existingUser = await userDAO.getUserByName(newName)
        if (existingUser != null) {
            return null
        }

        user.name = newName
        await user.save()
        return await userDAO.getUserByName(newName)
    } catch (error) {
        throw error
    }
  },

  updatePassword: async ({ name, currentPassword, newPassword }) => {
    try {
      const user = await userDAO.loginUser(name, currentPassword)
      if (!user) {
        return null
      }
      const newSalt = crypto.randomBytes(128).toString("base64")
      const newHashedPassword = await hashPassword(newPassword, newSalt)

      user.password = newHashedPassword
      user.salt = newSalt

      await user.save()
      return user
    } catch (error) {
      throw error
    }
  },

  sellCard: async ({ name, cardId }) => {
    try {
      const user = await userDAO.getUserByName(name)
      if (!user) {
        return false
      }

      if (!user.collection.includes(cardId)) {
        return false
      }

      user.collection = user.collection.filter((id) => id !== cardId)
      user.coins += 1 // Value to be determined since we have rarity but for now leave them at 1

      await user.save()
      return true
    } catch (error) {
      throw error
    }
  },

  addCards: async ({ name, cards }) => {
    try {
        const user = await userDAO.getUserByName(name)
        if (!user) {
            return null
        }

        const collection = user.collection
        cards.forEach(cardId => {
            if (collection.includes(cardId)) {
                user.coins += 1 // Same problem with the sell card, value is currently placeholder
            } else {
                collection.push(cardId)
            }
        });

        await user.save()
        return await userDAO.getUserByName(name)
    } catch (error) {
        throw error
    }
  },

  claimBooster: async ({ name, currentTime }) => {
    try {
      const user = await userDAO.getUserByName(name)
      if (!user) {
        return -1
      }

      user.boosters.push(currentTime)
      await user.save()
      return user.boosters.length // Should be 1 or 2 else :skull:
    } catch (error) {
      throw error
    }
  },

  buyBooster: async ({ name, price }) => {
    try {
      const user = await userDAO.getUserByName(name)
      if (!user) {
        return null
      }

      if (user.coins < price) {
        return null
      } 

      user.coins = user.coins - price
      await user.save()
      return await userDAO.getUserByName(name)
    } catch (error) {
      throw error
    }
  }
};

export default userDAO;
