const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const User = require("../models/User");

const auth = require("../middlewares/auth")

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
    res.redirect("/admin/articles")
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
      req.session.userID = user.id
        res.redirect("/admin/articles");
      } else {
        res.redirect("/login");
    }
  })
})


// GET "/register" -> User Register Page

router.get("/register", (req, res, next) => {
  if (req.session && req.session.userID) {
		res.redirect("/admin/articles");
  }
  res.render("register");
})

// POST "/register" -> Create a New User

router.post("/register", (req, res, next) => {
  User.create(req.body, (err, user) => {
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

module.exports = router;