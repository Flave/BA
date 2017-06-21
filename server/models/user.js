// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var shortid = require('shortid');

// define the schema for our user model
var userSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  predictions: [{id: String, value: Number}],
  email: String,
  facebook : {
    id : String,
    token : String,
    email : String,
    name : String,
    subs: [{
      id: String, name: String, username: String, thumb: String
    }]
  },
  twitter : {
    id : String,
    token : String,
    tokenSecret: String,
    email : String,
    displayName : String,
    username : String,
    subs: [{
      id: String, name: String, username: String, thumb: String
    }]
  },
  youtube : {
    id : String,
    token : String,
    tokenSecret: String,
    subs: [{
      id: String, name: String, username: String, thumb: String
    }]
  },
  instagram : {
    id : String,
    token : String,
    tokenSecret: String,
    subs: [{
      id: String, name: String, username: String, thumb: String
    }]
  }
});


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);