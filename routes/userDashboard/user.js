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
    console.log(file)
    cb(null, file.originalname.split(" ").join("-") + "-" + Date.now() + `.${file.mimetype.split("/").pop()}`);
  }
})

const upload = multer({ storage })

// GET "/user/dashboard" -> List all articles created by user

router.get("/dashboard", (req, res, next) => {
  console.log("Hello")
  Article.find({ userId: req.user.id }, (err, articles) => {
    if (err) return next(err);
    res.render("userDashboard/dashboard", { articles });
  });
})

// GET "/user/dashboard/new" -> Render a form for creating a new Article

router.get("/dashboard/new", (req, res, next) => {
  res.render("userDashboard/new");
})

// POST /user/dashboard/article

router.post("/dashboard/article/", upload.single("featureImage"), (req, res, next) => {
  Article.create({
    title: req.body.title,
    description: req.body.description,
    featureImage: req.file.filename,
    userId: req.user.id
  }, (err, article) => {
      if (err) return next(err);
      res.redirect("/user/dashboard")
  })
})

// GET "/user/dashboard/:id/edit" -> edit a article

router.get("/dashboard/:id/edit", (req, res, next) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) return next(err);
    if (req.user.id == article.userId) {
      res.render("userDashboard/edit", { article });
    } else {
      res.redirect("/user/dashboard");
    }
  })
})

// POST "/user/dashboard/:id/edit" -> Updating Article

router.post("/dashboard/:id/update", upload.single("featureImage"), (req, res, next) => {

  Article.findById(req.params.id, (err, article) => {
    if (err) return next(err);
    if (req.user.id == article.userId) {
      if (req.file) {
        req.body.featureImage = req.file.filename
      }
      
      Article.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false }, (err, article) => {
        if (err) return next(err);
        res.redirect("/user/dashboard");
      })
    } else {
      res.redirect("/user/dashboard");
    }
  })
  
})

// DELETE "/article/:id/delete" 

router.get("/dashboard/:id/delete", (req, res, next) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) return next(err);
    if (req.user.id == article.userId) {
      Article.findByIdAndDelete(req.params.id, (err, article) => {
        if (err) return next(err);
        res.redirect("/user/dashboard");
      })
    } else {
      res.redirect("/user/dashboard");
    }
  })
})

module.exports = router
