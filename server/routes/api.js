const express = require('express');
const fbApi = require('../external/fb');
const instagramApi = require('../external/instagram');
const amsApi = require('../external/ams');
const api = require('../api');
const User = require('../models/user');
const log = require('../../log');
const _ = require('lodash');
const Promise = require('promise');
const { getConnectedPlatforms, isLoggedInAjax } = require('../util');

const router = new express.Router();

let cachedUser;
let userCount;

// USER
router.get('/api/user', ({ user }, res) => {
  if(cachedUser) {
    res.json(cachedUser);
    return;
  }
  User.find({predictions: {$ne: null}})
    .count()
    .then(count => {
      log.rainbow('Sending USER');
      userCount = count;
      if(user) {
        cachedUser = stripUser(user);
        res.json(cachedUser);
      }
      else
        res.json({ login: null });
    })
    .catch(err => console.log(err));
});


// PROFILE
router.get('/api/profile/:id', isLoggedInAjax, (req, res) => {
  console.log("Profile Request");
  api.fetchProfile(req.params.id)
    .then(profile => {
      log.rainbow('Sending PROFILE');
      res.json(profile);
    })
    .catch((err) => {
      console.log(err);
    })
});

let all;

// ALL
router.get('/api/all', isLoggedInAjax, (req, res) => {
  if(all) {
    log.rainbow('Sending ALL');
    res.json(all);
    return;
  }
  User.find({}).then((users) => {
    let strippedUsers = _(users).map(user => {
      if(!user.predictions) return;
      return {
        id: user._id,
        predictions: user.predictions
      }
    })
    .compact()
    .value();
    all = strippedUsers;
    log.rainbow('Sending ALL');
    res.json(strippedUsers);
  });
});


// UPDATE USER
router.post('/api/user', isLoggedInAjax, (req, res) => {
  req.user = _.assign(req.user, req.body);
  req.user.save().then(user => {
    log.rainbow('Sending USER UPDATE');
    res.json(stripUser(user));
  })
  .catch(err => console.log(err));
});

//User.find({}, {_id: true, predictions: true}).then((users) => {

function stripUser(user) {
  return {
    name: user.facebook.name,
    login: user._id,
    returning: user.returning,
    userCount
  }
}

module.exports = router;