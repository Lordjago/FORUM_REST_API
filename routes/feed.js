const express = require('express');

const {check} = require('express-validator')

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post',[
    check('title')
        .trim()
        .isLength({min: 5}),
    check('title')
        .trim()
        .isLength({ min: 5 })
],  feedController.createPost);
//GET a single post
router.get('/post/:postId', feedController.getPostById);
//Update 
router.put('/post/:postId', [
    check('title')
        .trim()
        .isLength({ min: 5 }),
    check('title')
        .trim()
        .isLength({ min: 5 })
], feedController.updatePost)

//DELETE

router.delete('/post/:postId', feedController.deletePost)

module.exports = router;