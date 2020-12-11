// Global Modules

const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
const logger = require("morgan");
const log = require("log-beautify");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const index = require("./routes/index");
const admin = require("./routes/admin/admin")
const article = require("./routes/article");

// Connection with DB

mongoose.connect("mongodb://localhost:27017/personalBlog", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
	err ? log.error(err) : log.ok("Connected to DB")
});

// Express app

const app = express()

// Middleware

app.use(logger("dev"))
app.use(
	session({
    secret: "G#gYeIwpT%*pc@xYMiyG1x6HB&1laDI9Iq5fk^T9!VedLPJa9ngcX6c@u0@CnGFoeFVj@Ze8eyXLPWdN4^VEc17U5hbHtKvo@WMg",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 300000
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
	})
);
app.use(express.urlencoded({ extended: false }))
app.use(express.static("./pubic"))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

// Routing Middleware

app.use("/", index)
app.use("/admin", admin)
app.use("/article", article) 

// Error Handling

app.use((req, res, next) => {
  res.status(404).render("404")
})

app.use((err, req, res, next) => {
  res.status(500).render("error", { err })
})

// Listening

app.listen(3000, () => {
  log.info("Server is running on PORT 3000")
})
