// require('express-router-group')
import 'express-router-group'

// const express = require('express');

import express from 'express'

// const feedController = require('../controllers/feed');
import { 
    getIndex,
    getPosts, 
    createPost,
    getPostById,
    updatePost,
    deletePost
 } from '../controllers/feed.js'

const router = express.Router();

// const isAuth = require('../helper/is-auth')
import isAuth from '../helper/is-auth.js'

import {create, update} from '../helper/validator.js'



// GET /feed/posts
router.get('/', getIndex);
// GET /feed/posts
router.get('/posts', isAuth, getPosts);
// POST /feed/post
router.post('/post', create, isAuth, createPost);
//GET a single post
router.get('/post/:postId', isAuth, getPostById);
//Update 
router.put('/post/:postId', isAuth, update, updatePost)
//DELETE
router.delete('/post/:postId', isAuth, deletePost)

// router.group('/feed',  (router) => {
//     // GET /feed/posts
//     router.get('/posts', feedController.getPosts);
//     // POST /feed/post
//     router.post('/post', create, feedController.createPost);
//     //GET a single post
//     router.get('/post/:postId', feedController.getPostById);
//     //Update 
//     router.put('/post/:postId', update, feedController.updatePost)
//     //DELETE
//     router.delete('/post/:postId', feedController.deletePost)
// })


export default router;