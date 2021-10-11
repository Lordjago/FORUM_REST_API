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
    User.findOne({ email: email })
    .then((user) => {
         if (user) {
              return Promise.reject("Email address already exist")
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
   })
    .then((result) => {
        res.status(201).json({message: "User created"})
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

exports.getStatus = (req, res, next) => {
    User.findById(req.userId)
        .then((user) => {
            if (!user) {
                const error = new Error("User not Found");
                error.statusCode = 404
                throw error
            }
            res.status(200).json({status: user.status})
        })
        .catch((err) => {
            if (err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })

}

exports.updateUserStatus = (req, res, next) => {
    const newStatus = "req.body.status"
    console.log(newStatus)
    User.findById(req.userId)
        .then((user) => {
            if (!user) {
                const error = new Error("User not Found");
                error.statusCode = 404
                throw error
            }
            user.status = newStatus;
            return user.save()
        })
        .then((result) => {
            res.status(200).json({ message: "User status Updated" })
        })
        .catch((err) => {
            if (err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })

}