const router = require('express').Router(),
      // To deal w/ file uploads
      multer = require('multer'),
      upload = multer({
          dest: './uploads'
      }),
      UserController = require('../models/user'),
      passport = require('passport');

/* GET users listing. */
router.get('/', UserController.index );

router.get('/register', function(req, res) {
  res.render('register', { title: "Register" });
});

router.post('/register', upload.single('profile_image'), UserController.validateRegistration);
router.post(
            '/login',
            passport.authenticate('local', { failureRedirect: '/users/login', succesRedirect: '/', failureFlash: true }),
            UserController.login
          );

router.get('/login', function(req, res, next) {
    res.render('login', {
        title: "Login"
    });
});

module.exports = router;
