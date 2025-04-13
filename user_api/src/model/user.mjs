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
    ['salt', 'string'],
    ['coins', 'number'],
    ['collection', 'object'],
    ['boosters', 'object'],
    ['lastBooster', 'number'],
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
     * The user's salt for the password
     * @type {string}
     */
    salt

    /**
     * The user's available coins.
     * @type {number}
     */
    coins

    /**
     * The user's collection of card IDs (now array of numbers).
     * @type {Array<number>}
     */
    collection

    /** 
     * The user's last free booster timestamps inventory.
     * @type {Array<number>} 
     */
    boosters

    /**
     * The user's last free booster opened timestamp.
     * @type {Number}
     */
    lastBooster

    /**
     * Creates an instance of the User class.
     * Validates the properties and assigns them to the instance.
     * 
     * @param {Object} obj - An object representing the user with the following properties:
     * @param {string} obj.name - The user's name.
     * @param {string} obj.password - The user's password.
     * @param {string} obj.salt - The user's salt.
     * @param {number} [obj.coins=0] - The user's available coins. Defaults to 0 if not provided.
     * @param {Array<number>} [obj.collection=[]] - The user's collection of card IDs. Defaults to an empty array if not provided.
     * @param {Array<number>} [obj.boosters=[]] - The user's available free boosters. Defaults to an empty array.
     * @param {number} obj.lastBooster - The user's timestamp of the latest free booster opened.
     * 
     * @throws {UserException} If any of the following conditions are not met:
     * - `name` is missing.
     * - `password` is missing.
     * - `coins` is negative.
     * - `collection` is not an array of numbers.
     * - The data types of `obj` attributes don't match the expected types.
     */
    constructor(obj) {

        const twelveHoursAgo = Date.now() - 12 * 60 * 60 * 1000; // 12 hours in milliseconds

        // Default values
        obj.coins = obj.coins !== undefined ? obj.coins : 10;
        obj.collection = obj.collection !== undefined ? obj.collection : [];
        obj.boosters = obj.boosters !== undefined ? obj.boosters : [twelveHoursAgo, twelveHoursAgo];
        obj.lastBooster = obj.lastBooster !== undefined ? obj.lastBooster : Date.now();


        // Default values to hide protected values
        obj.password = obj.password !== undefined ? obj.password : "XXXXXXXXXX"
        obj.salt = obj.salt !== undefined ? obj.salt : "XXXXXXXXX"

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

        if (obj.salt.trim() === '') {
            throw new UserException('Salt is required')
        }

        if (isNaN(obj.coins) || obj.coins < 0) {
            throw new UserException('Coins must be a valid positive number');
        }

        if (obj.collection.some((cardId) => typeof cardId !== 'number')) {
            throw new UserException('Collection must be an array of numbers')
        }

        if (obj.boosters.length > 2) {
            throw new UserException('Boosters array must contain at most 2 timestamps')
        }

        if (isNaN(obj.lastBooster) || obj.lastBooster < 0) {
            throw new UserException('Timestamp must be a valid positive number');
        }

        // Assign properties to the instance
        Object.assign(this, obj)
    }
}

export default User
