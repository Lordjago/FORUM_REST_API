// require('dotenv').config()
import {} from 'dotenv/config'

import express from 'express'

import bodyParser from 'body-parser'

import mongoose from 'mongoose'

import feedRoutes from './routes/feed.js'

import authRoutes from './routes/auth.js'

import path, { dirname} from 'path'

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import multer from 'multer'

const app = express()

const MONGO_URI = process.env.CONNECTION_STRING

// import { v4: uuidv4 } from 'uuid'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({storage: storage, fileFilter: fileFilter}).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/feed', feedRoutes);

app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500;
    const data = error.data
    const message = error.message;
    res.status(status).json({
        message: message,
        data: data

    })
})

mongoose.connect(MONGO_URI)
.then(() => {
    console.log("Database Connection Successfull")
    // const server = 
    app.listen(process.env.PORT || 8080, console.log("Server running on port 8080"));
    // const io = require('socket.io')(server)
    // io.on('connection', socket => {
    //     console.log("Client Connected")
    // })
})
.catch((err) => {
    console.log(err)
})

