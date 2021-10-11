require('dotenv').config()

const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization').split(' ')[1];
    if (!authHeader) {
        const error = new Error('Token is require for Authorization.');
        error.statusCode = 401;
        throw error;
    }
    try {
        if(authHeader) {
            jwt.verify(authHeader, process.env.ACCESS_TOKEN, (err, decodedToken) => {
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



