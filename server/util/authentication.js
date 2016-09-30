// const passport = require('passport'),
// 			localStrategy = require('passport-local').Strategy,
// 			UserController = require('../models/user');
//
//
// // For use in user login, password athentication
// passport.use(new localStrategy(
// 		(username, password, done) => {
// 			console.log('he')
// 			console.log(UserController.getUserByUsername)
// 			UserController.getUserByUsername(username)
// 			.then((user) => {
// 				console.log(user);
// 				done()
// 			})
// 				// 	if (!user) {
// 				// 		done(null, false, { message: "Password/username don't match" });
// 				// 	}
// 				// 	return user
// 				// })
// 				// .then((user)=>{
// 				// 	return UserController.comparePassword(password, user.password)
// 				// 					.then( (something)=> {
// 				// 						console.log(something)
// 				// 					})
// 				// })
// 				// .then((isMatch)=>{
// 				// 	console.log(isMatch)
// 				// 	if (isMatch) {
// 				// 		done(null, user)
// 				// 	} else {
// 				// 		done(null, false, { message: "Password/username don't match" })
// 				// 	}
// 				// })
// 				// .catch((err) => {
// 				// 		console.log('here')
// 				// 		done(err);
// 				// })
// }));
