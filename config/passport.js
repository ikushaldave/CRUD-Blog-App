const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: "https://personal-blog-crud.herokuapp.com/auth/github/callback",
		},
		function (accessToken, refreshToken, profile, cb) {
			User.findOne({ email: profile._json.email }, (err, user) => {
				if (err) return cb(err, null);
				if (!user) {
					User.create(
						{
							email: profile._json.email,
							providers: ["github"],
							name: profile._json.name,
						},
						(err, user) => {
							if (err) return cb(err, null);
							return cb(null, user);
						}
					);
				}
				return cb(null, user);
			});
		}
	)
);

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "https://personal-blog-crud.herokuapp.com/auth/google/callback",
			passReqToCallback: true,
		},
		function (request, accessToken, refreshToken, profile, cb) {
			console.log(profile);
			User.findOne({ email: profile._json.email }, (err, user) => {
				if (err) return cb(err, null);
				if (!user) {
					User.create(
						{
							email: profile._json.email,
							providers: ["github"],
							name: profile._json.name,
						},
						(err, user) => {
							if (err) return cb(err, null);
							return cb(null, user);
						}
					);
				}
				return cb(null, user);
			});
		}
	)
);

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) return done(err, null);
    done(null, user)
  })
})