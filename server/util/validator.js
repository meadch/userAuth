const expressValidator = require('express-validator'),
      User = require('mongoose').model('User');

module.exports = function(app){
  // Validator
  // https://github.com/ctavan/express-validator
  // In this example, the formParam value is going to get morphed into form body format useful for printing.
  app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));
  app.use(expressValidator({
    customValidators: {
      isEmailAvailable: function(email) {
        return new Promise(function(resolve, reject) {
          User.findOne({ email })
          .then(function(user) {
            if (!user) {
              resolve(user);
            }
            else {
              console.log(`Found user: ${user}`);
              reject(user);
            }
          })
          .catch(function(error){
            if (error) {
              reject(error);
            }
          });
        });
      },
      isUsernameAvailable: function(username) {
        return new Promise(function(resolve, reject) {
          User.findOne({ username })
          .then(function(user) {
            if (!user) {
              resolve(user);
            }
            else {
              console.log(`Found user: ${user}`);
              reject(user);
            }
          })
          .catch(function(error){
            if (error) {
              reject(error);
            }
          });
        });
      }

    }
  }));
}
