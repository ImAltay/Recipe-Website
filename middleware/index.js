const Post = require("../models/user");
const comment = require("../models/comment");
const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be signed in to do that");
  res.redirect("back");
};

middlewareObj.checkPostOwnership = function(req, res, next) {
  //is user logged in?
  if (req.isAuthenticated()) {
    Post.findById(req.params.id, function(err, foundPost) {
      if (err) {
        req.flash("error", "Post not found");
        res.redirect("back");
      } else {
        //does user own the post?
        if (foundPost.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  //is user logged in?
  if (req.isAuthenticated()) {
    comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        //does user own the comment?
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash("error", "You Don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.isUserAdmin = function(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    req.flash("error", "You are not Osman");
    res.redirect("back");
  }
};

module.exports = middlewareObj;
