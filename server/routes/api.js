const express = require('express');
const fbApi = require('../external/fb');
const amsApi = require('../external/ams');
const api = require('../api');
const User = require('../models/user');
const log = require('../../log');
const _ = require('lodash');
const Promise = require('promise');

const router = new express.Router();

// LOGIN

router.get('/api/login', isLoggedInAjax, function(req, res) {
  res.json({
    login: req.user._id
  });
});


// ME

router.get('/api/user', isLoggedInAjax, ({ user }, res) => {
  res.json({
    name: user.facebook.name,
    login: user._id
  });
});


// PROFILE

router.get('/api/profile/:id', isLoggedInAjax, (req, res) => {
  User.findOne({_id: req.params.id })
    .then(fbApi.fetchFeed)
    .then((feed) => {
      res.json({
        feed: feed
      });
    });
});


// ALL
router.get('/api/all', isLoggedInAjax, (req, res) => {
  log.rainbow('Seinding all');
  User.find({}, {_id: true, predictions: true}).then((users) => {
    res.json(users);
  });
});


router.get('/api/predictions', isLoggedIn, function({ user }, res) {
  fbApi
    .fetchLikes(user)
    // then fetch the facebook likes
    .then((likes) => {
      let hasNewItems = !_.isEqual(user.facebook.likes.sort(), likes.sort());
      // if there are new like items, save them and get new prediction
      log.blue('got likes');
      if(hasNewItems) {
        user.facebook.likes = likes;
        return user.save()
          .then(() => {
            log.blue('gettig Prediction');
            return amsApi.getPrediction(user);
          });
      // if there are no new like items but no prediction yet, get prediction
      } else if(!user.predictions) {
        log.blue('just gettig Prediction, no likes');
        return amsApi.getPrediction(user);
      } else {
        log.blue('already got prediction');
        return Promise.resolve(user.predictions);        
      }
    })
    .then((predictions) => {
      user.predictions = predictions;
      user.save().then(() => {
        log.blue('Sending prediction');
        res.json(predictions);
      });
    })
    .catch((err) => {
      res.json({
        prediction: null
      });
      console.log(err);
    });
});


// FEED

router.get('/api/feed', isLoggedIn, ({ user }, res) => {
  fbApi
    .fetchFeed(user)
    .then(response => {
      res.json(response);
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