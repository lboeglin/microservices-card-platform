import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET 

/**
 * Express middleware for authenticating requests using a JWT token.
 * 
 * This middleware checks for the presence of an `Authorization` header,
 * verifies the JWT, and attaches the decoded user information to the `req` object.
 * If the token is missing or invalid, it sends an appropriate HTTP error response.
 * 
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 */
export default function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.status(401).json({ message: 'No token provided' })
    
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' })
    }
}
