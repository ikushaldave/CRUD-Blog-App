const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const Article = require("../models/Article");
const Comment = require("../models/Comment");

// GET /article/:id

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Article.findById(id).populate("comments").exec((err, article) => {
    if (err) return next(err)
    res.render("article", { article })
  })
})

// POST /article/:id/comment

router.post("/:id/comment", auth.verifyUserLoggedIn, (req, res, next) => {
  const id = req.params.id;
  req.body.name = `${req.user.firstName} ${req.user.lastName}`;
  req.body.email = req.user.email;
  req.body.userId = req.user.id
  req.body.articleId = id;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err)
    Article.findByIdAndUpdate(id, { $push: { comments: comment.id}, userId: req.user.id }, { new: true }, (err, article) => {
      if (err) return next(err)
      res.redirect(`/article/${id}`);
    })
  })
})

module.exports = router