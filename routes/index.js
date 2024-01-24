const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", function (req, res) {
  res.redirect("/posts");
});

////////////////
//AUTH ROUTES//
//////////////

//show register form
router.get("/register", (req, res) => {
  res.render("register");
});

//handle sign up logic
router.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function (err, user) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/register");
      }
      passport.authenticate("local")(req, res, function () {
        req.flash("success", "Welcome to Blog " + user.username);
        res.redirect("/posts");
      });
    }
  );
});

//login route
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login",
  }),
  (req, res) => {
    if (err) {
      console.log(err);
    }
  }
);

//logout route
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "Logged you out!");

  res.redirect("/posts");
});

module.exports = router;
