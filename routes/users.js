const router = require('express').Router(),
      // To deal w/ file uploads
      multer = require('multer'),
      upload = multer({dest: './uploads'});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: "Register" });
});
router.post('/register', upload.single('profile_image'), function(req, res, next) {
  const { name, email, username, password, password_confirm } = req.body;
  const profileImage = ( req.file ) ? req.file.filename : 'noimage.jpg';

  // Form validation
  const errors = validateRegistration(req);

  if (errors) {
    res.render('register', { errors })
  } else {
    console.log('no errors')
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: "Login" });
});

function validateRegistration(req){
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email field is invalid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password_confirm', 'Passwords must match').equals(req.body.password);
  return req.validationErrors();
}

module.exports = router;
