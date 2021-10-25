require('dotenv').config()

const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        const error = new Error('Not Authenticated.');
        error.statusCode = 401;
        throw error;
    }
    try {
        const token = authHeader.split(' ')[1];
        if(authHeader) {
            jwt.verify(token, process.env.ACCESS_TOKEN, (err, decodedToken) => {
                if(err) {
                    const error = new Error('Invalid Access Token.');
                    error.statusCode = 401;
                    throw error;
                }
                req.userId = decodedToken.userId
                next()
            })
        }
    } catch (error) {
        error.statusCode = 401
        throw error
    }
}



