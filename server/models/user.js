const mongoose = require('mongoose'),
    DB_URL = 'mongodb://localhost/nodeauth',
    bcrypt = require('bcryptjs');

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

module.exports = (function() {
    const UserController = {};

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

    return UserController;
}());
