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
  predictions: {
    demographics: [{trait: String, value: Number}],
    religion: [{trait: String, value: Number}],
    politics: [{trait: String, value: Number}],
    big5: [{trait: String, value: Number}],
    religion: [{trait: String, value: Number}]
  },
  email: String,
  facebook : {
    id : String,
    token : String,
    email : String,
    name : String,
    likes: Array
  },
  twitter : {
    id : String,
    token : String,
    tokenSecret: String,
    email : String,
    displayName : String,
    username : String
  }
});


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);