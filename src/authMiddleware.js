const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        throw new Error('Auth header not found')
    }
    const token = authHeader.split(' ')[1]
    let decodedToken
    try {
        decodedToken = jwt.verify(token, 'ejenghenduyerhsnehcyjeksleodjendy')
    } catch (error) {
        throw error
    }
    if (!decodedToken) {
        throw new Error('Not authorized')
    }
    next()
}