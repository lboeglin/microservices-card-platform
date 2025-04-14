import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRATION = '15m'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const REFRESH_TOKEN_EXPIRATION = '7d'

/**
 * Generates an access token using the provided payload.
 * @param {Object} payload - The data to be embedded within the token.
 * @returns {string} The signed JWT access token.
 */
export function generateAccessToken(payload) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION })
}

/**
 * Generates a refresh token using the provided payload.
 * @param {Object} payload - The data to be embedded within the token.
 * @returns {string} The signed JWT refresh token.
 */
export function generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION })
}

/**
 * Middleware to authenticate the refresh token, generate new access and refresh tokens, and attach them to the request.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function to call.
 * @returns {void}
 */
export function authenticateRefreshToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const refreshToken = authHeader.split(' ')[1];

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' })
        }

        const newAccessToken = generateAccessToken({ name: decoded.name })
        const newRefreshToken = generateRefreshToken({ name: decoded.name })

        req.newAccessToken = newAccessToken
        req.newRefreshToken = newRefreshToken

        req.user = decoded
        next()
    })
}

/**
 * Extracts the user's name from the JWT token in the authorization header.
 * @param {Object} req - The HTTP request object.
 * @returns {string} The name decoded from the JWT token.
 * @throws {Error} Throws an error if no token is found or if the token is invalid.
 */
export function extractNameFromToken(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        throw new Error("No token found")
    }
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw new Error("Invalid token")
    }
    const decoded = jwt.decode(token)
    if (!decoded?.name) {
        throw new Error("Invalid token")
    }
    return decoded.name
}
