const express = require('express');
const router = new express.Router();

// app/routes.js
module.exports = function(passport) {

  // facebook --------------------------------

  // route for facebook authentication and login
  router.get('/auth/facebook', passport.authenticate('facebook', { 
    scope : [
    'email', 
    'user_likes', 
    'user_friends', 
    'user_posts', 
    'user_actions.books', 
    'user_actions.music', 
    'user_actions.news', 
    'user_actions.video'
    ]
  }));
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
      var user = req.user;
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