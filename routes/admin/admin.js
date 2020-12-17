const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Article = require("../../models/Article");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

// GET "/admin/articles" -> List all articles created by admin (both draft and published)

router.get("/articles", (req, res, next) => {
  Article.find({ userId: req.session.userID }, (err, articles) => {
    if (err) return next(err);
    res.render("admin/admin", { articles });
  });
})

// GET "/admin/articles/new" -> Render a form for creating a new Article

router.get("/articles/new", (req, res, next) => {
  res.render("admin/new")
})

// POST /admin/articles/article

router.post("/articles/article/", upload.single("featureImage"), (req, res, next) => {
  console.log(req.file)
  Article.create({
    title: req.body.title,
    description: req.body.description,
    featureImage: req.file.filename,
    userId: req.user.id
  }, (err, article) => {
      if (err) return next(err);
      res.redirect("/admin/articles")
  })
})

// GET "/admin/articles/:id/edit" -> edit a article

router.get("/articles/:id/edit", (req, res, next) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) return next(err);
    if (req.session.userID == article.userId) {
      res.render("admin/edit", { article })
    } else {
      res.redirect("/admin/articles")
    }
  })
})

// Updating Article

router.post("/articles/:id/update", upload.single("featureImage"), (req, res, next) => {

  Article.findById(req.params.id, (err, article) => {
    if (err) return next(err);
    if (req.session.userID == article.userId) {
      if (req.file) {
        const base64 = fs.readFileSync(path.join(__dirname, `../../uploads/${req.file.filename}`), { encoding: "base64" });
        req.file.base64 = base64;
        req.body.featureImage = req.file
      }
      
      Article.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false }, (err, article) => {
        if (err) return next(err);
        res.redirect("/admin/articles")
      })
    } else {
      res.redirect("/admin/articles")
    }
  })
  
})

// DELETE "/article/:id/delete" 

router.get("/articles/:id/delete", (req, res, next) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) return next(err);
    if (req.session.userID == article.userId) {
      Article.findByIdAndDelete(req.params.id, (err, article) => {
        if (err) return next(err);
        res.redirect("/admin/articles")
      })
    } else {
      res.redirect("/admin/articles")
    }
  })
})

module.exports = router
