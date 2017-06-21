var configDB = require('../config/db');
var mongoose = require('mongoose');
var User = require('../server/models/user');
var fbApi = require('../server/external/fb');
mongoose.Promise = require('promise');
mongoose.connect(configDB.url); // connect to our database

User.find({}).then((users) => {
  users.forEach((user, i) => {
    fbApi
    .fetchRankedSubs(user)
    .then((subs, i) => {
      user.facebook.subs = subs;
      user.save().then(() => {
        console.log("Done with user: " + user.id)
      });
    })
    .catch(err => console.log(err))
  })
});