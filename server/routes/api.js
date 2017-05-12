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
    .then((user) => {
/*      amsApi.getPrediction(user)
        .then((predictions) => {
          user.predictions = predictions;
          user.save().then(() => {
            log.blue("got new predictions and saved this dude");
          })
          .catch((err) => {
            console.log(err);
          })
        })
        .then((err) => {
          console.log(err);
        });*/
      return fbApi.fetchFeed(user);
    })
    .then((feed) => {
      log.rainbow('Sending FEED');
      res.json(feed);
    })
    .catch((err) => {
      console.log(err);
    })
});

//User.find({}, {_id: true, predictions: true}).then((users) => {

// ALL
router.get('/api/all', isLoggedInAjax, (req, res) => {
  User.find({}).then((users) => {
    let strippedUsers = _.map(users, user => {
      let accounts = _.map(['facebook', 'twitter', 'youtube', 'instagram'], platform => (
        { 
          name: platform,
          isConnected: user[platform] && (user[platform].token !== undefined)
        }
      ));

      return {
        id: user._id,
        predictions: user.predictions,
        accounts: accounts
      }
    });

    log.rainbow('Sending ALL');
    res.json(strippedUsers);
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