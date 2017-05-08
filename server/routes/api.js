const express = require('express');
const fbApi = require('../apis/fb');
const amsApi = require('../apis/ams');
const User = require('../models/user');
const colors = require('colors');
const _ = require('lodash');
const Promise = require('promise');

const router = new express.Router();

// LOGIN

router.get('/api/login', isLoggedInAjax, function(req, res) {
  res.json({
    login: req.user._id
  });
});


// PROFILE

router.get('/api/profile', isLoggedInAjax, ({ user }, res) => {
  fetchPredictions(user)
    .then((predictions) => {
      console.log(colors.green('Seinding profile'));
      res.json({
        name: user.facebook.name,
        predictions: user.predictions || null,
        login: user._id
      });
    });
});


// ALL

router.get('/api/all', isLoggedInAjax, (req, res) => {
  console.log(colors.blue('Seinding all'));
  res.json({
    name: req.user.facebook.name,
    predictions: req.user.predictions || null,
    login: req.user._id
  });
});



// PREDICTIONS

function fetchPredictions(user) {
  return fbApi
    .fetchLikes(user)
    // then fetch the facebook likes
    .then((likes) => {
      let hasNewItems = !_.isEqual(user.facebook.likes.sort(), likes.sort());
      // if there are new like items, save them and get new prediction
      console.log(colors.blue('Got likes'));
      if(hasNewItems) {
        user.facebook.likes = likes;
        return user.save()
          .then(() => {
            console.log(colors.blue('Gettig Prediction'));
            return amsApi.getPrediction(user);
          });
      // if there are no new like items but no prediction yet, get prediction
      } else if(!user.predictions) {
        console.log(colors.blue('Just gettig Prediction, no likes'));
        return amsApi.getPrediction(user);
      } else {
        console.log(colors.blue('Already have prediction'));
        return Promise.resolve(user.predictions);        
      }
    })
    .then((predictions) => {
      user.predictions = predictions;
      return user.save().then(() => {
        console.log(colors.blue('Received Predictions'));
        return predictions;
      });
    })
    .catch((err) => {
      console.log(colors.red("Predictions fail"));
      console.log(err);
    });
}

router.get('/api/predictions', isLoggedIn, function({ user }, res) {
  fbApi
    .fetchLikes(user)
    // then fetch the facebook likes
    .then((likes) => {
      let hasNewItems = !_.isEqual(user.facebook.likes.sort(), likes.sort());
      // if there are new like items, save them and get new prediction
      console.log(colors.blue('got likes'));
      if(hasNewItems) {
        user.facebook.likes = likes;
        return user.save()
          .then(() => {
            console.log(colors.blue('gettig Prediction'));
            return amsApi.getPrediction(user);
          });
      // if there are no new like items but no prediction yet, get prediction
      } else if(!user.predictions) {
        console.log(colors.blue('just gettig Prediction, no likes'));
        return amsApi.getPrediction(user);
      } else {
        console.log(colors.blue('already got prediction'));
        return Promise.resolve(user.predictions);        
      }
    })
    .then((predictions) => {
      user.predictions = predictions;
      user.save().then(() => {
        console.log(colors.blue('Sending prediction'));
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