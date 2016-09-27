const mongoose = require('mongoose'),
      DB_URL = 'mongodb://localhost/nodeauth';

// mpromise (mongoose's default promise library) is deprecated, plug in your own promise library
mongoose.Promise = global.Promise;
mongoose.connect(DB_URL);

const db = mongoose.connection;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  profileImage: {
    type: String
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = (function(){
  const UserController = {};

  UserController.create = (req, res) => {
    res.json(['hello'])
  }

  UserController.validateRegistration = (req, res) => {
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email field is invalid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password_confirm', 'Passwords must match').equals(req.body.password);

    if (!req.validationErrors()) {
        req.check('email', 'Email Taken').isEmailAvailable();
    }

    req.asyncValidationErrors()
        .then( () => {
            UserController.create(req, res);
        })
        .catch( (errors) => {
          errors.forEach( ({msg}) => {
            req.flash('error flash', msg);
          })
          res.redirect('/users/register');
        });
  }

  return UserController;
}());
