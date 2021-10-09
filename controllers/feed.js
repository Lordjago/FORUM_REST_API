const { validationResult } = require('express-validator')

const Post = require('../model/post')

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((post) => {
      res.status(200).json({
        posts: post
      });
    })
    .catch((err) => {
      console.log(err)
    })

};

exports.createPost = (req, res, next) => {
  const error = validationResult(req)
  if(!error.isEmpty()) {
    return res.status(422).json({
      message: 'Validation Failed',
      errors: error.array()
    })
  }
  // Create post in db
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
      title: title, 
      content: content,
      imageUrl: '/images/1.jpg',
      creator: {name:"Opeyemi"},
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
      console.log(err)
    })
  
};
