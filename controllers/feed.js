const { validationResult } = require('express-validator')

const Post = require('../model/post');

const User = require('../model/user');

const { clearImage } = require('../helper/function');



exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const POST_PER_PAGE = 2
  let totalItems;
  Post.find().countDocuments()
  .then((count) => {
    totalItems =count
    return Post.find()
      .skip((currentPage - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
  })
  .then((posts) => {
      res.status(200).json({
        posts: posts,
        totalItems: totalItems
      });
  })
  .catch((err) => {
    if (err.statusCode) {
      err.statusCode = 500
    }
      next(err) 
    })
};

exports.createPost = (req, res, next) => {
  const error = validationResult(req)
  if(!error.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422
    error.data = error.array()
    throw error
    // res.json(error.array())
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
  let creator;
  const post = new Post({
      title: title, 
      content: content,
      imageUrl: imageUrl,
      creator: req.userId
  })
  post
    .save()
    .then((post) => {
        return User.findById(req.userId)
  })
  .then((user) => {
    creator = user;
    user.posts.push(post);
    return user.save()
  })
  .then((result) => {
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: {_id: creator._id, name: creator.name}
    })
  })
    .catch((err) => {
      if(err.statusCode) {
        err.statusCode = 500
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
          error.data = error.array()
          throw error
        }
        res.status(200).json({
          message: "Post fetched",
          post: post
        })
      })
      .catch((err) => {
        if (err.statusCode) {
          err.statusCode = 500
        }
        next(err)
      })
}

exports.updatePost = (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422
    error.data = error.array()
    throw error
  }
  const postId = req.params.postId
  const { title, content } = req.body
  let imageUrl = req.body.image
  if(req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }
  if(!imageUrl) {
    const error = new Error("Image is not selected.");
    error.statusCode = 422
    throw error
  }

  Post.findById(postId)
  .then((post) => {
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 422
      throw error
    }
    if (post.creator.toString() !== req.userId) {
    const error = new Error("Not Authorized.");
    error.statusCode = 403
    throw error
  }
    if(imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl)
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    return post.save();
  })
  .then((result) => {
    res.status(200).json({message: "Updated"})
    console.log(result)
  })
  .catch((err) => {
    if (err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  })

}

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId
  Post.findById(postId)
  .then((post) =>{
    //check loggin user
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 422
      // error.data = error.array()
      throw error
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not Authorized.");
      error.statusCode = 403
      throw error
    }
    //clear image from local storage
    clearImage(post.imageUrl);
    return Post.findByIdAndRemove(postId)
  })
  .then((result) => {
    User.findById(req.userId)
      .then((user) => {
        user.posts.pull(postId)
        return user.save()
    })
  })
  .then((result) => {
    res.status(200).json({ message: 'Deleted Post.' })
  })
  .catch((err) => {
      if (err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}
