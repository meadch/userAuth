const passport = require('passport'),
			localStrategy = require('passport-local').Strategy,
			UserController = require('../models/user');

module.exports = function(app) {
		app.use(passport.initialize());
		app.use(passport.session());
}

// For use in user login, password athentication
passport.use(new localStrategy(
		{usernameField: 'username', passwordField: 'password'},
		(username, password, done) => {
			UserController.getUserByUsername(username)
				.then((user) => {
						if (!user) {
								return done(null, false, { message: "Password/username don't match" });
						}
						UserController.comparePassword(password, user.password)
								.then((isMatch) => {
										if (isMatch) {
												return done(null, user)
										}
										return done(null, false, { message: "Password/username don't match" })
								})
								.catch((err) => {
										return done(err)
								})
				})
				.catch((err) => {
						throw err;
			})
}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
		UserController.getUserById(id)
		.then( (user) => {
			done(err, user);
		})
});
