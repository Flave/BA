// config/passport.js
// https://github.com/scotch-io/easy-node-authentication/blob/linking/config/passport.js

// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

// load up the user model
var User = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(new FacebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL,
    profileFields: ["email", "displayName"],
    passReqToCallback : true

  },

  // facebook will send back the token and profile
  function(req, token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

      // check if the user is already logged in
      if (!req.user) {

        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
          if (err) {
            return done(err);
          }

          if (user) {
            // if there is a user id already but no token (user was linked at one point and then removed)
            if (!user.facebook.token) {
              user.facebook.token = token;
              user.facebook.name  = profile.displayName;
              user.facebook.email = profile.emails[0].value;

              user.save(function(err) {
                if (err)
                  throw err;
                return done(null, user);
              });
            }

            return done(null, user); // user found, return that user
          } else {
            // if there is no user, create them
            var newUser            = new User();
            newUser.facebook.id    = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name  = profile.displayName;
            newUser.facebook.email = profile.emails[0].value;

            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });

      } else {
        // user already exists and is logged in, we have to link accounts
        var user            = req.user; // pull the user out of the session

        user.facebook.id    = profile.id;
        user.facebook.token = token;
        user.facebook.name  = profile.displayName;
        user.facebook.email = profile.emails[0].value;

        user.save(function(err) {
          if (err)
            throw err;
          return done(null, user);
        });

      }
    });
  }));


  // =========================================================================
  // TWITTER =================================================================
  // =========================================================================

  passport.use(new TwitterStrategy({

    consumerKey     : configAuth.twitterAuth.consumerKey,
    consumerSecret  : configAuth.twitterAuth.consumerSecret,
    callbackURL     : configAuth.twitterAuth.callbackURL,
    passReqToCallback : true

  },
    // twitter will send back the token and profile
  function(req, token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

      // check if the user is already logged in
      if (!req.user) {

        User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
          if (err)
            return done(err);

          if (user) {

            // if there is a user id already but no token (user was linked at one point and then removed)
            if (!user.twitter.token) {
              user.twitter.token = token;
              user.twitter.name  = profile.name;
              user.twitter.email = profile.emails[0].value;

              user.save(function(err) {
                if (err)
                  throw err;
                return done(null, user);
              });
            }

            return done(null, user); // user found, return that user
          } else {
            // if there is no user, create them
            var newUser = new User();
            newUser.twitter.id    = profile.id;
            newUser.twitter.token = token;
            newUser.twitter.name  = profile.name;

            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });

      } else {
        // user already exists and is logged in, we have to link accounts
        var user            = req.user; // pull the user out of the session

        user.twitter.id    = profile.id;
        user.twitter.token = token;
        user.twitter.name  = profile.name;

        user.save(function(err) {
          if (err)
            throw err;
          return done(null, user);
        });

      }
    });

  }));

};