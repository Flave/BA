const express = require('express');
const fbApi = require('../api/fb');
const amsApi = require('../api/ams');
const User = require('../models/user');
const colors = require('../../colorlog');
const _ = require('lodash');
const Promise = require('promise');

const router = new express.Router();

router.get('/api/login', function(req, res) {
  if(req.isAuthenticated())
    res.json({
      login: req.user._id
    });
  else
    res.json({
      login: null
    });
});

router.get('/api/profile', isLoggedIn, ({ user }, res) => {
  colors.blue('Seinding profile');
  res.json({
    name: user.facebook.name,
    predictions: user.predictions || null
  });
});

router.get('/api/predictions', isLoggedIn, function(req, res) {
  let user = req.user;
  fbApi
    .fetchLikes(user)
    // then fetch the facebook likes
    .then((likes) => {
      let hasNewItems = !_.isEqual(user.facebook.likes.sort(), likes.sort());
      // if there are new like items, save them and get new prediction
      colors.blue('got likes');
      if(hasNewItems) {
        user.facebook.likes = likes;
        return user.save()
          .then(() => {
            colors.blue('gettig Prediction');
            return amsApi.getPrediction(user);
          });
      // if there are no new like items but no prediction yet, get prediction
      } else if(!user.predictions) {
        colors.blue('just gettig Prediction, no likes');
        return amsApi.getPrediction(user);
      } else {
        colors.blue('already got prediction');
        return Promise.resolve(user.predictions);        
      }
    })
    .then((predictions) => {
      user.predictions = predictions;
      user.save().then(() => {
        colors.blue('sending prediction');
        res.json({
          predictions: predictions
        });
      });
    })
    .catch((err) => {
      res.json({
        prediction: null
      });
      console.log(err);
    })
});

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