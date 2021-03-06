// Global Modules

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const logger = require("morgan");
const log = require("log-beautify");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const index = require("./routes/index");
const userDashboard = require("./routes/userDashboard/user");
const article = require("./routes/article");
const auth = require("./middlewares/auth");
const passport = require("passport");
const port = process.env.PORT || 3000;

require("dotenv").config();
require("./config/passport")

// Connection with DB

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/personalBlog?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
	err ? log.error(err) : log.ok("Connected to DB");
});

// Express app

const app = express()

// Middleware

app.use(logger("dev"))
app.use(
  session({
    name: "SID",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    cookie: {
      maxAge: 60480000
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
	})
);
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(express.static("./public"))
app.use(passport.session())
app.use(auth.currentLoggedUserInfo);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

// Routing Middleware

app.use("/", index)
app.use("/user", auth.verifyUserLoggedIn, userDashboard)
app.use("/article", article) 

// Error Handling

app.use((req, res, next) => {
  res.status(404).render("404")
})

app.use((err, req, res, next) => {
  res.status(500).render("error", { err })
})

// Listening

app.listen(port, () => {
  log.info(`Server is running on PORT ${port}`)
})
