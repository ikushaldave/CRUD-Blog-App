const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Article = require("../../models/Article");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + "-" + Date.now() + `.${file.mimetype.split("/").pop()}`);
	},
});

const upload = multer({ storage });

// GET "/admin/articles" -> List all articles created by admin (both draft and published)

router.get("/articles", (req, res, next) => {
  if (req.session && req.session.userID) {
    Article.find({}, (err, articles) => {
      if (err) return next(err);
      res.render("admin/admin", { articles });
    });
  } else {
    return next("Access Denied");
  }
})

// GET "/admin/articles/new" -> Render a form for creating a new Article

router.get("/articles/new", (req, res, next) => {
  res.render("admin/new")
})

// POST /admin/articles/article

router.post("/articles/article/", upload.single("featureImage"), (req, res, next) => {
  
  if (req.file) {
    const base64 = fs.readFileSync(path.join(__dirname, `../../uploads/${req.file.filename}`), { encoding: "base64" })
    req.file.base64 = base64
  }

  Article.create({
    title: req.body.title,
    description: req.body.description,
    featureImage: req.file
  }, (err, article) => {
      if (err) return next(err);
      res.redirect("/admin/articles")
  })
})

// GET "/admin/articles/:id/edit" -> edit a article

router.get("/articles/:id/edit", (req, res, next) => {
  Article.findById(req.params.id, (err, article) => {
    if (err) return next(err);
    res.render("admin/edit", { article })
  })
})

// Updating Article

router.post("/articles/:id/update", upload.single("featureImage"), (req, res, next) => {
  
  if (req.file) {
		const base64 = fs.readFileSync(path.join(__dirname, `../../uploads/${req.file.filename}`), { encoding: "base64" });
    req.file.base64 = base64;
    req.body.featureImage = req.file
    
  }
  
  Article.findByIdAndUpdate(req.params.id, req.body, { new: true , useFindAndModify: false},(err, article) => {
    if (err) return next(err);
    res.redirect("/admin/articles")
  })
})

// DELETE "/article/:id/delete" 

router.get("/articles/:id/delete", (req, res, next) => {
  Article.findByIdAndDelete(req.params.id, (err, article) => {
    if (err) return next(err);
    res.redirect("/admin/articles")
  })
})

module.exports = router
