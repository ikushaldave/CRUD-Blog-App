const User = require("../models/User");
const Article = require("../models/Article")

module.exports = {
  verifyUserLoggedIn: (req, res, next) => {
    if (req.session && (req.session.user || req.session.passport.user)) {
      next()
    } else {
      res.redirect("/login")
    }
  },
  currentLoggedUserInfo: async (req, res, next) => {
    if (req.session && req.session.user) {
      const id = req.session.user;
      try {
        const user = await User.findById(id, { name: 1, email: 1 });
        req.user = user;
        res.locals.user = user;
        console.log(req.user.id);
        return next();
      } catch (err) {
        return next(err)
      }
    }
    
    if (req.session && req.session.passport) {
      res.locals.user = req.user;
      return next()
    }
    
    req.user = null;
    res.locals.user = null;
    return next();
  }
}