// const mongoose = require('mongoose')
import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true,
        default: "I am new"
    },
    posts: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }
]

}, {timestamps: true})

// module.exports = mongoose.model('User', userSchema)
export default mongoose.model('User', userSchema)