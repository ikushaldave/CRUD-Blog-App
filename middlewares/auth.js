const User = require("../models/User");
const Article = require("../models/Article")

module.exports = {
  verifyUserLoggedIn: (req, res, next) => {
    if (req.session && req.session.userID) {
      next()
    } else {
      res.redirect("/login")
    }
  },
  currentLoggedUserInfo: (req, res, next) => {
    if (req.session && req.session.userID) {
      const userID = req.session.userID;
      User.findById(userID, { firstName: 1, lastName: 1, email: 1 }, (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
        next()
      })
    } else {
      req.user = null;
      res.locals.user = null;
      next()
    }
  }
}