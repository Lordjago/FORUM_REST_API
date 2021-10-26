// const mongoose = require('mongoose')
import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        allownull: false
    },
    imageUrl: {
        type: String,
        required: true,
        allownull: false
    },
    content: {
        type: String,
        required: true,
        allownull: false
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{ timestamps: true})


// module.exports = mongoose.model('Post', postSchema)
export default mongoose.model('Post', postSchema)