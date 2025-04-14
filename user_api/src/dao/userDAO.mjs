"use strict";

import { mongoose } from "mongoose";
import User from "../model/user.mjs";
import { hashPassword, verifyPassword } from "../utils/hashing.mjs";
import crypto from "crypto";
import { Int32 } from "mongodb";

/**
 * Mongoose schema for a user.
 */
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
    type: String,
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
  },
  boosters: {
    type: [Number],
    required: true,
  },
  lastBooster: {
    type: Number,
    required: true,
  },
});

/**
 * Projection to exclude sensitive fields from query results.
 */
const projection = { _id: 0, __v: 0, password: 0, salt: 0 };

/**
 * Converts a Mongoose user document to a `User` instance.
 * @param {Object} mongooseUser - Mongoose user document.
 * @returns {User|null} Adapted user object or null.
 */
const adapter = (mongooseUser) => {
  if (!mongooseUser) {
    return null;
  }
  mongooseUser = mongooseUser.toJSON();
  return new User(mongooseUser);
};

const MongoUser = mongoose.model("User", userSchema);

/**
 * Data Access Object for users in MongoDB.
 */
const userDAO = {
  /**
   * Fetch a user by their username.
   * @param {string} name - Username to look for.
   * @returns {Promise<User|null>} The found user or null.
   */
  getUserByName: async (name) => {
    try {
      const user = await MongoUser.findOne({ name: name }, projection);
      if (!user) {
        return null;
      }
      return adapter(user);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new user if name is unique and valid.
   * @param {string} name - New user's name.
   * @param {string} password - Plaintext password.
   * @returns {Promise<User|null>} Created user or null on failure.
   */
  createUser: async (name, password) => {
    try {
      if (name.trim() == "" || password.trim() == "") {
        return null;
      }

      const res = await userDAO.getUserByName(name);
      if (res != null) {
        return null;
      }

      const salt = crypto.randomBytes(128).toString("base64");
      const hashedPassword = await hashPassword(password, salt);

      const now = Date.now();
      const newUser = new MongoUser({
        name,
        password: hashedPassword,
        salt,
        coins: 10,
        collection: [],
        boosters: [now, now],
        lastBooster: now,
      });

      await newUser.save();
      return await userDAO.getUserByName(name);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login a user by verifying credentials.
   * @param {string} name - Username.
   * @param {string} password - Password to verify.
   * @returns {Promise<Object|null>} User document if login is valid, else null.
   */
  loginUser: async (name, password) => {
    try {
      const user = await MongoUser.findOne({ name: name }, { _id: 0, __v: 0 });
      if (!user) {
        throw new Error(`No fucking user named : ${name} `);
      }

      const correct = await verifyPassword(user.password, password, user.salt);
      return correct ? user : null;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a user by their name.
   * @param {string} name - Username to delete.
   * @returns {Promise<boolean>} True if deleted.
   */
  deleteUserByName: async (name) => {
    try {
      const user = await userDAO.getUserByName(name);
      if (!user) {
        throw new Error("User not found");
      }

      await MongoUser.deleteOne({ name: name });
      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change a user's name if the new one is available.
   * @param {string} name - Current username.
   * @param {string} newName - Desired new username.
   * @returns {Promise<User|null>} Updated user or null if not possible.
   */
  updateUserName: async (name, newName) => {
    try {
      const user = await MongoUser.findOne({ name: name });
      if (!user) {
        return null;
      }

      const existingUser = await userDAO.getUserByName(newName);
      if (existingUser != null) {
        return null;
      }

      user.name = newName;
      await user.save();
      return await userDAO.getUserByName(newName);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a user's password after validating the current one.
   * @param {string} name - Username.
   * @param {string} currentPassword - Current password.
   * @param {string} newPassword - New password.
   * @returns {Promise<Object|null>} Updated user or null if current password is invalid.
   */
  updatePassword: async (name, currentPassword, newPassword) => {
    try {
      const check = await userDAO.loginUser(name, currentPassword);
      if (!check) {
        return null;
      }

      const user = await MongoUser.findOne({ name: name });
      const newSalt = crypto.randomBytes(128).toString("base64");
      const newHashedPassword = await hashPassword(newPassword, newSalt);

      user.password = newHashedPassword;
      user.salt = newSalt;

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Removes a card from the user's collection and gives them coins.
   * @param {string} name - Username.
   * @param {number} cardId - ID of the card to sell.
   * @returns {Promise<number>} Updated coin balance.
   */
  sellCard: async (name, cardId) => {
    try {
      const user = await MongoUser.findOne({ name: name });
      if (!user) {
        throw new Error("No user found");
      }

      if (!user.collection.includes(cardId)) {
        throw new Error(`The user does not have this card`);
      }

      user.collection = user.collection.filter(id => id != cardId);
      user.coins += 1;

      await user.save();
      return user.coins;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Adds cards to a user's collection. Gives coins for duplicates.
   * @param {string} name - Username.
   * @param {number[]} cards - List of card IDs.
   * @returns {Promise<User|null>} Updated user or null.
   */
  addCards: async (name, cards) => {
    try {
      const user = await MongoUser.findOne({ name: name });
      if (!user) {
        return null;
      }

      const collection = user.collection;
      cards.forEach(cardId => {
        if (user.collection.includes(cardId)) {
          user.coins += 1;
        } else {
          collection.push(cardId);
        }
      });

      await user.save();
      return await userDAO.getUserByName(name);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Adds a booster to a user's account if under the limit.
   * @param {string} name - Username.
   * @param {number} currentTime - Current timestamp.
   * @returns {Promise<number>} Booster count after claiming.
   */
  claimBooster: async (name, currentTime) => {
    try {
      const user = await MongoUser.findOne({ name: name });
      if (!user) {
        throw new Error("No user found");
      }
      if (user.boosters.length == 2) {
        throw new Error("Max 2 booster claimed per user");
      }
      user.boosters.push(currentTime);
      await user.save();
      return user.boosters.length;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deducts coins from the user to buy a booster.
   * @param {string} name - Username.
   * @param {number} price - Cost of the booster.
   * @returns {Promise<User|null>} Updated user or null if failed.
   */
  buyBooster: async (name, price) => {
    try {
      const user = await MongoUser.findOne({ name: name });
      if (!user) {
        return null;
      }

      if (user.coins < price) {
        return null;
      }

      user.coins = user.coins - price;
      await user.save();
      return await userDAO.getUserByName(name);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Uses a booster if available and updates the last used time.
   * @param {string} name - Username.
   * @returns {Promise<number>} Number of boosters left after using.
   */
  useBooster: async (name) => {
    try {
      const user = await MongoUser.findOne({ name: name });
      if (!user) {
        throw new Error("Invalid user name");
      }

      if (user.boosters.length < 1) {
        throw new Error(`You currently have no booster available`);
      }

      user.boosters.shift();
      user.lastBooster = Date.now();
      await user.save();
      return user.boosters.length;
    } catch (error) {
      throw error;
    }
  }
};

export default userDAO;
