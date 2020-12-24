const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const User = require("../models/User");

const auth = require("../middlewares/auth")
const passport = require("passport")

// GET "/" -> Home Page of Articles

router.get("/", (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
		res.render("articles.ejs", { articles });
  });
})

// GET "/login" -> Login Page for register

router.get("/login", (req, res, next) => {
  if (req.session && req.session.userID) {
    res.redirect("/user/dashboard")
  }
  res.render("login")
})

// POST "/login" -> verification

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if(!user) return res.redirect("/login")
    if (user.verifyPassword(password)) {
      req.session.user = user.id
        res.redirect("/user/dashboard");
      } else {
        res.redirect("/login");
    }
  })
})


// GET "/register" -> User Register Page

router.get("/register", (req, res, next) => {
  if (req.session && req.session.userID) {
		res.redirect("/user/dashboard");
  }
  res.render("register");
})

// POST "/register" -> Create a New User

router.post("/register", (req, res, next) => {
  User.create({
    email: req.body.email,
    name: `${req.body.firstName} ${req.body.lastName}`,
    local: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    }
  }, (err, user) => {
    if (err) return next(err);
    res.redirect("/login")
  })
})

// GET "/logout" -> deleting a session

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err)
    res.redirect("/")
  })
  res.clearCookie("SID")
})

// GET "/auth/github"

router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

// GET "/auth/github/callback"

router.get(
	"/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }), function (req, res) {
    res.redirect("/user/dashboard");
});

module.exports = router;