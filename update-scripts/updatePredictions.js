var _ = require('lodash');
var configDB = require('../config/db');
var mongoose = require('mongoose');
var User = require('../server/models/user');
var api = require('../server/api');
mongoose.Promise = require('promise');
mongoose.connect(configDB.url); // connect to our database

User.find({}).then((users) => {
  users.forEach((user, i) => {
    api.fetchPredictions(user)
      .then(() => {
        return done(null, user);
      })
      .catch((err) => {
        throw err;
      });
  })
});