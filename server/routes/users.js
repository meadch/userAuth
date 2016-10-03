import { Router } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-local'
import multer from 'multer';
import {
  UserController
} from '../controllers';

// Pull from settings at root level for file uploads
const settings = require('../../settings');

const usersRouter = Router(),
      upload = multer({
          dest: settings.PROJECT_DIR + '/uploads'
      });

usersRouter.route('/')
  .get(UserController.index);

usersRouter.route('/register')
  .get(UserController.register)
  .post(upload.single('profile_image'), UserController.validateRegistration)

usersRouter.route('/login')
  .get(UserController.login)
  .post(
    passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}), UserController.login
  )

usersRouter.route('/logout')
  .get(UserController.logout)


passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
		UserController.getUserById(id)
		.then( (user) => {
			done(null, user);
		})
    .catch( (err) => {
      console.log(err);
    });
});


passport.use(new Strategy((username, password, done) => {
    UserController.getUserByUsername(username)
        .then((user) => {
            if (!user) {
                return done(null, false, {
                    message: 'Unknown User'
                });
            } else {
                return UserController.comparePassword(password, user.password)
                    .then((isMatch) => {
                        return (isMatch) ? done(null, user) : done(null, false, {
                            message: 'Invalid Password'
                        });
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        })
        .catch((err) => {
            console.log(err);
        })
}));

export default usersRouter
