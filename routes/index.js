const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// GET "/" -> Home Page of Articles

router.get("/", (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
		res.render("articles.ejs", { articles });
  });
})

// GET "/admin-login" -> Login Page for admin

router.get("/admin-login", (req, res, next) => {
  res.render("login")
})


module.exports = router;