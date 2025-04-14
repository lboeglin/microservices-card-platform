import crypto from 'crypto';

/**
 * Hashes a password using the PBKDF2 algorithm.
 * @param {string} password - The plain text password to be hashed.
 * @param {string} salt - The salt used in the hashing process.
 * @param {number} [iterations=10000] - The number of iterations for the PBKDF2 algorithm.
 * @param {number} [keylen=64] - The desired length of the derived key.
 * @returns {Promise<string>} A promise that resolves with the hashed password as a hex string.
 */
export function hashPassword(password, salt, iterations = 10000, keylen = 64) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keylen, 'sha512', (error, derivedKey) => {
            if (error) {
                return reject(error)
            }
            resolve(derivedKey.toString('hex'))
        })
    })
}

/**
 * Verifies whether a plain text password matches the stored hashed password.
 * @param {string} storedHash - The previously stored hashed password to compare against.
 * @param {string} password - The plain text password to verify.
 * @param {string} salt - The salt used in the hashing process.
 * @param {number} [iterations=10000] - The number of iterations for the PBKDF2 algorithm.
 * @param {number} [keylen=64] - The desired length of the derived key.
 * @returns {Promise<boolean>} A promise that resolves with a boolean indicating if the password is valid (true) or invalid (false).
 * @throws {Error} If there is an error during the hashing process.
 */
export async function verifyPassword(storedHash, password, salt, iterations = 10000, keylen = 64) {
    try {
        const hashedPassword = await hashPassword(password, salt, iterations, keylen)
        return storedHash === hashedPassword
    } catch (error) {
        throw error
    }
}
