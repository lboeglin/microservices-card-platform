'use strict'

import userDAO from "../dao/userDAO.mjs"

/**
 * Controller for managing user-related operations.
 */
const userController = {
    /**
     * Retrieves a user by their username.
     * @param {string} name - The username to search for.
     * @returns {Promise<Object|null>} A user object if found, otherwise null.
     */
    getUserByName: async (name) => {
        return await userDAO.getUserByName(name)
    },

    /**
     * Registers a new user.
     * @param {string} name - The desired username.
     * @param {string} password - The desired password.
     * @returns {Promise<Object>} The created user object.
     */
    register: async (name, password) => {
        return await userDAO.createUser(name, password) 
    },

    /**
     * Authenticates a user with the provided credentials.
     * @param {string} name - The username.
     * @param {string} password - The password.
     * @returns {Promise<Object|null>} A user object if login is successful, otherwise null.
     */
    loginUser: async (name, password) => {
        return await userDAO.loginUser(name, password)
    },

    /**
     * Deletes a user by username.
     * @param {string} name - The username of the account to delete.
     * @returns {Promise<boolean>} True if deletion was successful.
     */
    deleteUser: async (name) => {
        return await userDAO.deleteUserByName(name)
    },

    /**
     * Updates a user's username.
     * @param {string} name - The current username.
     * @param {string} newName - The new username.
     * @returns {Promise<boolean>} True if the update was successful.
     */
    updateName: async (name, newName) => {
        return await userDAO.updateUserName(name, newName)
    },

    /**
     * Updates a user's password.
     * @param {string} name - The username.
     * @param {string} currentPassword - The current password.
     * @param {string} newPassword - The new password.
     * @returns {Promise<boolean>} True if the update was successful.
     */
    updatePassword: async (name, currentPassword, newPassword) => {
        return await userDAO.updatePassword(name, currentPassword, newPassword)
    },

    /**
     * Retrieves the card collection of a user.
     * @param {string} name - The username.
     * @returns {Promise<Array|undefined>} The user's card collection, or undefined if user not found.
     */
    getCollection: async (name) => {
        const user = await userDAO.getUserByName(name)
        return user ? user.collection : user
    },

    /**
     * Sells a specific card from a user's collection.
     * @param {string} name - The username.
     * @param {number} cardId - The ID of the card to sell.
     * @returns {Promise<boolean>} True if the card was successfully sold.
     */
    sellCard: async (name, cardId) => {
        return await userDAO.sellCard(name, cardId)
    },

    /**
     * Adds cards to a user's collection.
     * @param {string} name - The username.
     * @param {Array<Object>} cards - An array of card objects to add.
     * @returns {Promise<boolean>} True if cards were successfully added.
     */
    addCards: async (name, cards) => {
        return await userDAO.addCards(name, cards)
    },

    /**
     * Allows a user to claim a booster pack if eligible.
     * @param {string} name - The username.
     * @param {number} currentTime - Current timestamp for eligibility check.
     * @returns {Promise<Object>} The result of the claim attempt.
     */
    claimBooster: async (name, currentTime) => {
        return await userDAO.claimBooster(name, currentTime)
    },

    /**
     * Purchases a booster pack for a user.
     * @param {string} name - The username.
     * @param {number} [price=1] - The cost of the booster pack.
     * @returns {Promise<boolean>} True if purchase was successful.
     */
    buyBooster: async (name, price = 1) => {
        return await userDAO.buyBooster(name, price)
    },

    /**
     * Uses a booster pack from the user's inventory.
     * @param {string} name - The username.
     * @returns {Promise<Array<Object>>} An array of cards obtained from the booster.
     */
    useBooster: async (name) => {
        return await userDAO.useBooster(name)
    }
}

export default userController

