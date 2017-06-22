const express = require('express');
const fbApi = require('../external/fb');
const instagramApi = require('../external/instagram');
const amsApi = require('../external/ams');
const api = require('../api');
const User = require('../models/user');
const log = require('../../log');
const _ = require('lodash');
const Promise = require('promise');
const { getConnectedPlatforms } = require('../util');

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
router.get('/api/profile/:id', isLoggedInAjax, (req, res) => {
  User.findOne({_id: req.params.id })
    .then(user => {
      log.rainbow('Sending PROFILE');
      res.json({
        id: user.id,
        predictions: user.predictions,
        subs: user.facebook.subs,
        platforms: getConnectedPlatforms(user)
      });
    })
    .catch((err) => {
      console.log(err);
    })
});

// ALL
router.get('/api/all', isLoggedInAjax, (req, res) => {
  User.find({}).then((users) => {
    let strippedUsers = _(users).map(user => {
      if(!user.predictions) return;
      return {
        id: user._id,
        predictions: user.predictions,
        platforms: getConnectedPlatforms(user)
      }
    })
    .compact()
    .value();

    log.rainbow('Sending ALL');
    res.json(strippedUsers);
  });
});

// API TEST
/*router.get('/api/test', isLoggedInAjax, (req, res) => {
  instagramApi
    .fetchRankedSubs(req.user)
    .then(subs => {
      res.json(subs);
    })
    .catch(err => console.log(err));
});*/

// FEED
router.get('/api/feed/:id', isLoggedInAjax, (req, res) => {
  api.fetchFeed(req.params.id)
    .then(feed => {
      log.rainbow('Sending FEED');
      res.json(feed);
    })
    .catch(err => console.log(err));
});

//User.find({}, {_id: true, predictions: true}).then((users) => {

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