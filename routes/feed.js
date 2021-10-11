require('express-router-group')

const express = require('express');

const feedController = require('../controllers/feed');

const router = express.Router();

const isAuth = require('../helper/is-auth')

const {create, update} = require('../helper/validator')


// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);
// POST /feed/post
router.post('/post', create, isAuth, feedController.createPost);
//GET a single post
router.get('/post/:postId', isAuth, feedController.getPostById);
//Update 
router.put('/post/:postId', isAuth, update, feedController.updatePost)
//DELETE
router.delete('/post/:postId', isAuth, feedController.deletePost)

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


module.exports = router;