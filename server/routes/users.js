const router = require('express').Router(),
    // To deal w/ file uploads
    multer = require('multer'),
    upload = multer({
        dest: './uploads'
    }),
    UserController = require('../models/user')


/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find()
        .then((users) => res.json(users))
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: "Register" });
});

router.post('/register', upload.single('profile_image'), UserController.validateRegistration )

router.get('/login', function(req, res, next) {
    res.render('login', {
        title: "Login"
    });
});

module.exports = router;
