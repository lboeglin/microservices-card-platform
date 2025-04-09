import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const TOKEN_SECRET = process.env.TOKEN_SECRET
const TOKEN_EXPIRATION = '1h'

export function generateToken(payload) {
    return jwt.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRATION })
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Token missing' })
    }

    try {
        const payload = jwt.verify(token, TOKEN_SECRET)

        const newToken = generateToken({ id: payload.id, username: payload.username })
        res.setHeader('Authorization', `Bearer ${newToken}`)

        req.user = payload
        next()
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' })
    }
}
