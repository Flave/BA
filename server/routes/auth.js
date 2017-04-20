const express = require('express');

const router = new express.Router();

// app/routes.js
module.exports = function(passport) {

  // always send index file if specific page is requested. 
  // Routing will be done in the browser
  router.get('/profile', function(req, res) {
    res.render('index.ejs', {
      user: req.user
    }); // load the index.ejs files
  });

  router.get('/someone', function(req, res) {
    res.render('index.ejs', {
      user: req.user
    }); // load the index.ejs files
  });

  router.get('/', function(req, res) {
    res.render('index.ejs', {
      user: req.user
    }); // load the index.ejs files
  });


  // facebook --------------------------------

  // route for facebook authentication and login
  router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email', 'user_likes'] }));
  router.get('/auth/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook', {
        successRedirect: '/', 
        failureRedirect: '/'
      })(req, res, next);
  });

  // route for facebook authorization
  router.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));
  router.get('/connect/facebook/callback',
      passport.authorize('facebook', {
          successRedirect : '/profile',
          failureRedirect : '/'
      }));

  // route for unlinking facebook
  router.get('/unlink/facebook', function(req, res) {
      var user            = req.user;
      user.facebook.token = undefined;
      user.save(function(err) {
          res.redirect('/profile');
      });
  });


  // twitter --------------------------------

  // send to twitter to do the authentication
  router.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
  router.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  // send to twitter to do the authorization
  router.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));
  router.get('/connect/twitter/callback',
      passport.authorize('twitter', {
          successRedirect : '/profile',
          failureRedirect : '/'
      }));

  // route for unlinking twitter
  router.get('/unlink/twitter', function(req, res) {
      var user           = req.user;
      user.twitter.token = undefined;
      user.save(function(err) {
         res.redirect('/profile');
      });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}