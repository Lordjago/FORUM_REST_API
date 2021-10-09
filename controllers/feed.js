const { validationResult } = require('express-validator')

const path = require('path')

const Post = require('../model/post')

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        posts: posts
      });
    })
    .catch((err) => {
      console.log(err)
    })

};

exports.createPost = (req, res, next) => {
  const error = validationResult(req)
  if(!error.isEmpty()) {
    // const error = new Error("Validation Failed");
    // error.statusCode = 422
    // throw error 
    res.json(error.array())
  }
  if(!req.file) {
    const error = new Error("No image found.");
    error.statusCode = 422
    throw error
  }
  // Create post in db
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace("\\", "/");
  const post = new Post({
      title: title, 
      content: content,
      imageUrl: imageUrl,
      creator: {
        name:"Opeyemi"
      },
  })
  post
    .save()
    .then((post) => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: post
    })
  })
    .catch((err) => {
      if(err.statusCode) {
        err.statusCode = 5
      }
      next(err)
    })
  
};

exports.getPostById = (req, res, next) => {
    const id = req.params.postId
    Post.findById(id)
      .then((post) => { 
        if(!post) {
          const error = new Error("Could not find post.");
          error.statusCode = 422
          throw error
        }
        res.status(200).json({
          message: "Post fetched",
          post: post
        })
      })
      .catch((err) => {
        if (err.statusCode) {
          err.statusCode = 5
        }
        next(err)
      })
}