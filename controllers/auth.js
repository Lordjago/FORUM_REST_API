const User = require('../model/user')

const { validationResult } = require('express-validator')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

require('dotenv').config()

exports.signup = (req, res, next) => { 
    const { email, name, password } = req.body;
    const error = validationResult(req)
    if (!error.isEmpty()) {
        // const error = new Error("Validation Failed");
        // error.statusCode = 422
        // // error.data = error.array()
        // throw error
        console.log(error.array())
    }
   
    bcrypt.hash(password, 12)
    .then((hashedPassword => {
        const user = new User({
            email: email,
            password: hashedPassword,
            name: name 
        })
        return user.save()
    }))
    .then((result) => {
        res.status(201).json({message: "User created", userId: result._id   })
    })
    .catch((err) => {
        if (err.statusCode) {
                err.statusCode = 5
        }
            next(err)
        })
    

}

exports.login = (req, res, next) => {
    const {email, password} = req.body
    let loadedUser;
    const error = validationResult(req)
    if(!error.isEmpty()) {
        const error = new Error("Validation Failed");
        error.statusCode = 422
        // error.data = error.array()
        throw error
    }
    User.findOne({email: email})
    .then((user) => {
        if(!user) {
            const error = new Error("User with this email does not exist");
            error.statusCode = 401
            throw error
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password)
    })
    .then((isEqual) => {
       if(!isEqual) {
           const error = new Error("Password do not match");
        //    error.statusCode = 401;
           throw error;
       }
       const token = jwt.sign({email: loadedUser.email, userId: loadedUser._id}, process.env.ACCESS_TOKEN, {expiresIn: '1h'})

       res.status(201).json({
           message:"Success", 
           token: token, 
           userId: loadedUser._id
        })
    })
    .catch((err) => {
            if (err.statusCode) {
                err.statusCode = 5
            }
            next(err)
        })

}