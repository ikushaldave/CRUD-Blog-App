const express = require("express");
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

router.post("/:id/comment", (req, res, next) => {
  const id = req.params.id;
  req.body.articleId = id;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err)
    Article.findByIdAndUpdate(id, { $push: { comments: comment.id } }, { new: true }, (err, article) => {
      if (err) return next(err)
      res.redirect(`/article/${id}`);
    })
  })
})

module.exports = router