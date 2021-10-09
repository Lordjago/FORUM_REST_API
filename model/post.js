const mongoose = require('mongoose')

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
        type: Object,
        required: String,
        allownull: false
    }
},{ timestamps: true})


module.exports = mongoose.model('Post', postSchema)