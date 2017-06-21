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
          successRedirect : '/',
          failureRedirect : '/'
      }));

  // route for unlinking facebook
  router.get('/disconnect/facebook', function(req, res) {
      var user = req.user;
      user.facebook.token = undefined;
      user.save(function(err) {
          res.redirect('/');
      });
  });


  // twitter --------------------------------

  // send to twitter to do the authentication
  router.get('/auth/twitter', passport.authenticate('twitter', { scope : ['email'] }));
  router.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/',
      failureRedirect : '/'
    }));

  // send to twitter to do the authorization
  router.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));
  router.get('/connect/twitter/callback',
      passport.authorize('twitter', {
          successRedirect : '/',
          failureRedirect : '/'
      }));

  // route for unlinking twitter
  router.get('/disconnect/twitter', function(req, res) {
      var user           = req.user;
      user.twitter.token = undefined;
      user.twitter.subs = undefined;
      user.save(function(err) {
         res.redirect('/');
      });
  });


    // gogle --------------------------------

  // send to gogle to do the authorization
  router.get('/connect/youtube', passport.authorize('youtube', { scope : ['https://www.googleapis.com/auth/youtube.readonly'] }));


  router.get('/connect/youtube/callback', 
    passport.authorize('youtube', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

  // route for unlinking google
  router.get('/disconnect/youtube', function(req, res) {
      var user           = req.user;
      user.youtube.token = undefined;
      user.youtube.tokenSecret = undefined;
      user.youtube.subs = undefined;
      user.save(function(err) {
         res.redirect('/');
      });
  });


    // instagram --------------------------------

  // send to instagram to do the authorization
  router.get('/connect/instagram', passport.authorize('instagram', { scope : ['basic', 'follower_list', 'public_content'] }));


  router.get('/connect/instagram/callback', 
    passport.authorize('instagram', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });


  // route for unlinking instagram
  router.get('/disconnect/instagram', function(req, res) {
      var user = req.user;
      user.instagram.token = undefined;
      user.instagram.tokenSecret = undefined;
      user.instagram.subs = undefined;
      user.save(function(err) {
         res.redirect('/');
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