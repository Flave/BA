const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const { isLoggedIn } = require('../util');


// always send index file if specific page is requested. 
// Routing will be done in the browser
router.get('/me', function(req, res) {
  res.render('index.ejs', {
    user: req.user
  }); // load the index.ejs files
});

function profile(req, res) {
  User.findOne({_id: req.params.id })
    .then((user) => {
      if(!user)
        res.redirect('/');
      else
        res.render('index.ejs', {});
    });
}

router.get('/:id/feed', isLoggedIn, profile);
router.get('/:id/sources', isLoggedIn, profile);

router.get('/', function(req, res) {
  res.render('index.ejs', {
    user: req.user
  }); // load the index.ejs files
});

router.get('/content', function(req, res) {
  res.render('index.ejs', {
    user: req.user
  }); // load the index.ejs files
});

module.exports = router;