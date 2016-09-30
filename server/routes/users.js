const router = require('express').Router(),
      // To deal w/ file uploads
      multer = require('multer'),
      upload = multer({
          dest: './uploads'
      }),
      UserController = require('../models/user'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', UserController.index );

router.get('/register', function(req, res) {
  res.render('register', { title: "Register" });
});

router.post('/register', upload.single('profile_image'), UserController.validateRegistration);

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: "Login"
  });
});

router.post(
            '/login',
            passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
            function(req, res){
              req.flash('success', "logged in")
              res.redirect('/')
            }
          );

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', "You're logged out!")
  res.redirect('/users/login')
})

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


passport.use(new LocalStrategy((username, password, done) => {
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

module.exports = router;
