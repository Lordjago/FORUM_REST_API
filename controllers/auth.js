import User from '../model/user.js'

import { validationResult } from 'express-validator'

import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

import {} from 'dotenv/config'

// require('dotenv').config()

export const _signup = async (req, res, next) => { 
    const { email, name, password } = req.body;
    const error = validationResult(req)
    if (!error.isEmpty()) {
        const error = new Error("Validation Failed");
        error.statusCode = 422
        // error.data = error.array()
        throw error
        // console.log(error.array())
    }
    try {
        const exist = await User.findOne({ email: email })
         if (exist) {
              return Promise.reject("Email address already exist")
        }
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const user = new User({
                email: email,
                password: hashedPassword,
                name: name 
            })
    await user.save()
    res.status(201).json({message: "User created"})
    } catch (error) {
        if (!error.statusCode) {
                error.statusCode = 5
        }
            next(error)
    }

}

export const _login = async (req, res, next) => {
    const {email, password} = req.body
    const error = validationResult(req)
    if(!error.isEmpty()) {
        const error = new Error("Validation Failed");
        error.statusCode = 422
        // error.data = error.array()
        throw error
    }
    try {
         const user = await User.findOne({email: email})
        if(!user) {
            const error = new Error("User with this email does not exist");
            error.statusCode = 401
            throw error
        }
        const isEqual = bcrypt.compare(password, user.password)
        if(!isEqual) {
            const error = new Error("Password do not match");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({email: user.email, userId: user._id}, process.env.ACCESS_TOKEN, {expiresIn: '1h'})

        res.status(201).json({
            message:"Success", 
            token: token, 
            userId: user._id
            })
    } catch (error) {
        if (!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
            return error
    }

}

export const _getStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
            if (!user) {
                const error = new Error("User not Found");
                error.statusCode = 404
                throw error
            }
            res.status(200).json({status: user.status})
    } catch (error) {
         if (!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
    }
}

export const _updateUserStatus = async (req, res, next) => {
    const newStatus = "req.body.status"
    console.log(newStatus)
    try {
        const user = await User.findById(req.userId)
            if (!user) {
                const error = new Error("User not Found");
                error.statusCode = 404
                throw error
            }
            user.status = newStatus;
    await user.save()
    res.status(200).json({ message: "User status Updated" })
    } catch (error) {
        if (!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
    }

}