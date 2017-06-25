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


// USER
router.get('/api/user', ({ user }, res) => {
  User.find()
    .count()
    .then(count => {
      log.rainbow('Sending USER');
      if(user)
        res.json({
          name: user.facebook.name,
          login: user._id,
          userCount: count
        });
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

// ALL
router.get('/api/all', isLoggedInAjax, (req, res) => {
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

    log.rainbow('Sending ALL');
    res.json(strippedUsers);
  });
});

//User.find({}, {_id: true, predictions: true}).then((users) => {


module.exports = router;