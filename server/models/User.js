const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  acc_connections: [{type: String}],
  pnd_connections: [{type: String}],
  req_connections: [{type: String}],
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
