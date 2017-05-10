const express = require('express');
const fbApi = require('../external/fb');
const amsApi = require('../external/ams');
const api = require('../api');
const User = require('../models/user');
const log = require('../../log');
const _ = require('lodash');
const Promise = require('promise');

const router = new express.Router();


// USER

router.get('/api/user', isLoggedInAjax, ({ user }, res) => {
  log.rainbow('Sending USER');
  res.json({
    name: user.facebook.name,
    login: user._id
  });
});


// PROFILE

router.get('/api/user/:id', isLoggedInAjax, (req, res) => {
  log.blue("Requested ONE USER");
  User.findOne({_id: req.params.id })
    .then(fbApi.fetchFeed)
    .then((feed) => {
      log.rainbow('Sending PROFILE');
      res.json({
        feed: feed
      });
    })
    .catch((err) => {
      console.log(err);
    })
});


// FEED
router.get('/api/feed/:id', isLoggedInAjax, (req, res) => {
  User.findOne({_id: req.params.id })
    .then(fbApi.fetchFeed)
    .then((feed) => {
      log.rainbow('Sending FEED');
      res.json(feed);
    })
    .catch((err) => {
      console.log(err);
    })
});


// ALL
router.get('/api/all', isLoggedInAjax, (req, res) => {
  log.rainbow('Sending ALL');
  User.find({}, {_id: true, predictions: true}).then((users) => {
    res.json(users);
  });
});

// route middleware to make sure
function isLoggedInAjax(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.json(null);
}

// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}


function test() {
  User.find({}, (err, users) => {
    
  })
}

module.exports = router;