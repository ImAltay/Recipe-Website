var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/posts/:id/comments/new", middleware.isLoggedIn, function(
  req,
  res
) {
  // find post by id
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { post: post });
    }
  });
});

router.post("/posts/:id/comments", middleware.isLoggedIn, function(req, res) {
  //lookup post using ID
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      res.redirect("/posts");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", "Something went wrong");
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save commment
          comment.save();
          post.comments.push(comment);
          post.save();
          req.flash("success", "Successfully added comment");
          res.redirect("/posts/" + post._id);
        }
      });
    }
  });
});

router.get(
  "/posts/:id/comments/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, function(err, foundcomment) {
      if (err) {
        res.redirect("back");
      } else {
        res.render("comments/edit", {
          post_id: req.params.id,
          comment: foundcomment
        });
      }
    });
  }
);

router.put(
  "/posts/:id/comments/:comment_id",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
      err,
      updatedComment
    ) {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/posts/" + req.params.id);
      }
    });
  }
);
router.delete(
  "/posts/:id/comments/:comment_id",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
      if (err) {
        res.redirect("back");
      } else {
        req.flash("success", "Comment deleted");
        res.redirect("/posts/" + req.params.id);
      }
    });
  }
);

module.exports = router;
