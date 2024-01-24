var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var middleware = require('../middleware');

//INDEX - show all posts
router.get('/posts', function(req, res) {
  // Get all posts from DB
  Post.find({}, function(err, allPosts) {
    if (err) {
      console.log(err);
    } else {
      res.render('posts/index', { posts: allPosts, currentUser: req.user });
    }
  });
});

//CREATE - add new post to DB
router.post('/posts', middleware.isUserAdmin, function(req, res) {
  // get data from posts and add to posts array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var texty = req.body.text;
  var serving = req.body.serving;
  var createdAt = req.body.createdAt;
  var prepTime = req.body.prepTime;
  var calories = req.body.calories;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var ingredients = req.body.ingredients;
  var steps = req.body.steps;
  var newPost = {
    name: name,
    image: image,
    description: desc,
    author: author,
    text: texty,
    serving: serving,
    createdAt: createdAt,
    prepTime: prepTime,
    calories: calories,
    ingredients: ingredients,
    steps: steps
  };

  // Create a new post and save to DB
  Post.create(newPost, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to posts page
      res.redirect('/posts');
      console.log(newlyCreated);
    }
  });
});

//NEW - show form to create new Post
router.get('/posts/new', middleware.isUserAdmin, function(req, res) {
  res.render('posts/new');
});

// SHOW - shows more info about one post
router.get('/posts/:id', function(req, res) {
  //find the post with provided ID
  Post.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundPost) {
      if (err) {
        console.log(err);
      } else {
        //render show template with that post
        res.render('posts/show', { post: foundPost });
      }
    });
});

//EDIT ROUTE
router.get('/posts/:id/edit', middleware.isUserAdmin, (req, res) => {
  Post.findById(req.params.id, function(err, foundPost) {
    res.render('posts/edit', { post: foundPost });
  });
});

//UPDATE ROUTE
router.put('/posts/:id', middleware.isUserAdmin, (req, res) => {
  //find and update the correct post
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(
    err,
    updatedPost
  ) {
    if (err) {
      res.redirect('/posts');
    } else {
      res.redirect('/posts/' + req.params.id);
    }
  });
});

//DESTROY POST ROUTE
router.delete('/posts/:id', middleware.isUserAdmin, (req, res) => {
  Post.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect('/posts');
    } else {
      res.redirect('/posts');
    }
  });
});

module.exports = router;
