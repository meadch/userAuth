import bcrypt from 'bcryptjs';
const User = require('mongoose').model('User');

export default (function() {
    const UserController = {};

    UserController.register = (req, res) => {
      return res.render('register', { title: "Register" })
    }

    UserController.index = (req, res) => {
        User.find({})
            .then((users) => {
                res.json(users);
            })
    }

    UserController.create = (req, res) => {
        const profileImage = (req.file) ? req.file.filename : "noimage.jpg";
        const newUser = {
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          profileImage
        }
        // Hash password before saving to database
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                newUser.password = hash;
                User.create(newUser)
                .then( (createdUser) => {
                  req.flash('success flash', "Successfully registered! Please login.");
                  res.redirect('/');
                })
            });
        });
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
            .then(() => {
                UserController.create(req, res);
            })
            .catch((errors) => {
                errors.forEach(({msg}) => {
                    req.flash('error flash', msg);
                })
                res.redirect('/users/register');
            });
    }

    UserController.login = (req, res, done) => {
      if (req.isAuthenticated()) {
        res.redirect('/')
      } else {
        res.render('login', {
          title: "Login"
        });
      }
    }

    UserController.logout = (req, res) => {
      req.logout();
      req.flash('success', "You're logged out!");
      res.redirect('/users/login');
    }

    UserController.getUserByUsername = (username) => {
      return User.findOne({ username });
    }

    UserController.getUserById = (id) => {
      return User.findById(id)
    }

    UserController.comparePassword = (password, hash, cb) => {
      return new Promise( (resolve, reject) => {
        bcrypt.compare(password, hash, (err, isMatch) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(isMatch);
          }
        });
      })
    }
    return UserController;
}());
