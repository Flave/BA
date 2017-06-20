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
    subs: [{id: String, relevance: Number}]
  },
  twitter : {
    id : String,
    token : String,
    tokenSecret: String,
    email : String,
    displayName : String,
    username : String,
    subs: [{id: String, relevance: Number}]
  },
  youtube : {
    id : String,
    token : String,
    tokenSecret: String
  },
  instagram : {
    id : String,
    token : String,
    tokenSecret: String
  }
});


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);