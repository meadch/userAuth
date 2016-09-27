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

mongoose.model('User', UserSchema);
