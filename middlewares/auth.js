module.exports = {
  verifyUserLoggedIn: (req, res, next) => {
    if (req.session && req.session.userID) {
      next()
    } else {
      res.redirect("/login")
    }
  }
}