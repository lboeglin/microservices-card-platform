'use strict'

/**
 * Custom error class to handle user-related exceptions.
 */
class UserException extends Error {
    /**
     * Creates an instance of the UserException.
     * @param {string} message - The error message to describe the exception.
     */
    constructor(message) {
        super(message)
        this.name = 'UserException'
    }
}

/**
 * A Map that stores expected attribute names and their corresponding types for the User object.
 * @type {Map<string, string>}
 */
const attributsNamesAndTypes = new Map([
    ['name', 'string'],
    ['password', 'string'],
    ['coins', 'number'],
    ['collection', 'object']
])

/**
 * Represents a User with specific properties and methods.
 * 
 * @class User
 */
class User {
    /**
     * The user's name.
     * @type {string}
     */
    name

    /**
     * The user's password.
     * @type {string}
     */
    password

    /**
     * The user's available coins.
     * @type {number}
     */
    coins

    /**
     * The user's collection of card IDs.
     * @type {Array<string>}
     */
    collection

    /**
     * Creates an instance of the User class.
     * Validates the properties and assigns them to the instance.
     * 
     * @param {Object} obj - An object representing the user with the following properties:
     * @param {string} obj.name - The user's name.
     * @param {string} obj.password - The user's password.
     * @param {number} [obj.coins=0] - The user's available coins. Defaults to 0 if not provided.
     * @param {Array<string>} [obj.collection=[]] - The user's collection of card IDs. Defaults to an empty array if not provided.
     * 
     * @throws {UserException} If any of the following conditions are not met:
     * - `name` is missing.
     * - `password` is missing.
     * - `coins` is negative.
     * - `collection` is not an array of strings.
     * - The data types of `obj` attributes don't match the expected types.
     */
    constructor(obj) {

        // Default values
        obj.coins = obj.coins !== undefined ? obj.coins : 0
        obj.collection = obj.collection !== undefined ? obj.collection : []

        // Validate data types
        const objNamesAndTypes = new Map(Object.entries(obj).map(([key, value]) => 
            [key, typeof value]))

        if (!(attributsNamesAndTypes.size === objNamesAndTypes.size &&
            Array.from(attributsNamesAndTypes.keys()).every((key) => 
                attributsNamesAndTypes.get(key) === objNamesAndTypes.get(key)))) {
            throw new UserException('Invalid user object')
        }

        // Validate 'name' and 'password'
        if (obj.name.trim() === '') {
            throw new UserException('Name is required')
        }
        
        if (obj.password.trim() === '') {
            throw new UserException('Password is required')
        }

        if (isNaN(obj.coins)|| obj.coins < 0) {
            throw new UserException('Coins must be a valid positive number');
        }

        if (obj.collection.some((cardId) => typeof cardId !== 'string')) {
            throw new UserException('Collection must be an array of card IDs')
        }

        // Assign properties to the instance
        Object.assign(this, obj)
    }
}

export default User

