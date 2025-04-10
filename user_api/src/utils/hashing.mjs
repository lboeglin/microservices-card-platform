import crypto from 'crypto';

export function hashPassword(password, salt, iterations = 10000, keylen = 64) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keylen, 'sha512', (error, derivedKey) => {
            if (error) {
                return reject(error);
            }
            resolve(derivedKey.toString('hex'));
        });
    });
}

export async function verifyPassword(storedHash, password, salt, iterations = 10000, keylen = 64) {
    try {
        const hashedPassword = await hashPassword(password, salt, iterations, keylen)
        return storedHash === hashedPassword
    } catch (error) {
        throw error
    }
}

