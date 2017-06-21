// config/passport.js
// https://github.com/scotch-io/easy-node-authentication/blob/linking/config/passport.js
// https://vladimirponomarev.com/blog/authentication-in-react-apps-jwt

// load all the things we need
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const YoutubeStrategy = require('passport-youtube-v3').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const User = require('../models/user');
const configAuth = require('../../config/auth')[process.env.NODE_ENV];
const api = require('../api');
const log = require('../../log');

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
    clientID : configAuth.facebookAuth.clientID,
    clientSecret : configAuth.facebookAuth.clientSecret,
    callbackURL : configAuth.facebookAuth.callbackURL,
    profileFields : ["email", "displayName"],
    passReqToCallback : true

  },

//User.findOne({'$or': [{'email': profile.emails[0].value}, {'facebook.id': profile.id}]}, (err, user) => {

  // facebook will send back the token and profile
  function(req, token, refreshToken, profile, done) {
    // asynchronous
    process.nextTick(function() {
      // check if the user is already logged in
      if (!req.user)
        User.findOne({'$or': [{'email': profile.emails[0].value}, {'facebook.id': profile.id}]}, (err, user) => {
          if (err)
            return done(err);
          if (user)
            if(!user.facebook.token)
              // if there is a user id already but no token (user was linked at one point and then removed)
              linkFacebookAccount(user, token, profile, done);
            else
              return done(null, user); // user found, return that user
          else
            // if there is no user, create them
            createNewUser(token, profile, done);
        });
      else
        // user already exists and is logged in, we have to link accounts
        linkFacebookAccount(req.user, token, profile, done);
    });
  }));


  function createNewUser(token, profile, done) {
    var newUser            = new User();
    newUser.facebook.id    = profile.id;
    newUser.facebook.token = token;
    newUser.facebook.name  = profile.displayName;
    newUser.facebook.email = profile.emails[0].value;
    newUser.email = profile.emails[0].value;
    newUser.save((err, user) => {
      if (err)
        throw err;
      api.fetchPredictions(user)
        .then(() => {
          return done(null, user);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  function linkFacebookAccount(user, token, profile, done) {
    user.facebook.id = profile.id;
    user.facebook.token = token;
    user.facebook.name  = profile.displayName;
    user.facebook.email = profile.emails[0].value;

    user.save((err) => {
      if (err)
        throw err;
      api.fetchPredictions(user)
        .then(() => {
          return done(null, user);
        })
        .catch((err) => {
          throw err;
        });
      return done(null, user);
    });
  }

  // =========================================================================
  // TWITTER =================================================================
  // =========================================================================

  passport.use(new TwitterStrategy({
    consumerKey     : configAuth.twitterAuth.consumerKey,
    consumerSecret  : configAuth.twitterAuth.consumerSecret,
    callbackURL     : configAuth.twitterAuth.callbackURL,
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
    passReqToCallback : true

  },
    // twitter will send back the token and profile
  function(req, token, tokenSecret, profile, done) {
    // asynchronous
    process.nextTick(() => {
      // check if the user is already logged in
      if (!req.user)
        User.findOne({'$or': [{'email': profile.emails[0].value}, {'twitter.id': profile.id}]}, (err, user) => {
          if (err)
            return done(err);
          if (user)
            if (!user.twitter.token)
              // if there is a user id already but no token (user was linked at one point and then removed)
              linkTwitterAccount(user, token, tokenSecret, profile, done);
            else
              return done(null, user); // user found, return that user
          else
            createNewTwitter(token, tokenSecret, profile, done);
        });

      else
        // user already exists and is logged in, we have to link accounts
        linkTwitterAccount(req.user, token, tokenSecret, profile, done);
    });

  }));

  function createNewTwitter(token, tokenSecret, profile, done) {
    // if there is no user, create them
    var newUser = new User();
    newUser.twitter.id    = profile.id;
    newUser.twitter.token = token;
    newUser.twitter.tokenSecret = tokenSecret;
    newUser.twitter.name  = profile.name;
    newUser.twitter.email = profile.emails[0].value;
    newUser.email = profile.emails[0].value;

    newUser.save().then((user) => {
      api
        .updateTwitterSubs(user)
        .then(() => {
          return done(null, newUser);
        });
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function linkTwitterAccount(user, token, tokenSecret, profile, done) {
    user.twitter.id    = profile.id;
    user.twitter.token = token;
    user.twitter.tokenSecret = tokenSecret;
    user.twitter.name  = profile.name;
    user.twitter.email = profile.emails[0].value;

    user.save().then((user) => {
      api
        .updateTwitterSubs(user)
        .then(() => {
          return done(null, user);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  // =========================================================================
  // YOUTUBE =================================================================
  // =========================================================================

  passport.use(new YoutubeStrategy({
    clientID : configAuth.youtubeAuth.clientID,
    clientSecret : configAuth.youtubeAuth.clientSecret,
    callbackURL : configAuth.youtubeAuth.callbackURL,
    passReqToCallback : true

  },
    // twitter will send back the token and profile
  function(req, token, tokenSecret, profile, done) {
    process.nextTick(() => {
        linkYoutubeAccount(req.user, token, tokenSecret, profile, done);
    });
  }));


  function linkYoutubeAccount(user, token, tokenSecret, profile, done) {
    user.youtube = {};
    user.youtube.id    = profile.id;
    user.youtube.token = token;
    user.youtube.tokenSecret = tokenSecret;

    user.save().then((user) => {
      api
        .updateYoutubeSubs(user)
        .then(() => {
          return done(null, user);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  }


  // =========================================================================
  // INSTAGRAM ===============================================================
  // =========================================================================

  passport.use(new InstagramStrategy({
      clientID : configAuth.instagramAuth.clientID,
      clientSecret : configAuth.instagramAuth.clientSecret,
      callbackURL : configAuth.instagramAuth.callbackURL,
      passReqToCallback : true
    },
    function(req, token, tokenSecret, profile, done) {
      process.nextTick(() => {
          linkInstagramAccount(req.user, token, tokenSecret, profile, done);
      });
    }
  ));

  function linkInstagramAccount(user, token, tokenSecret, profile, done) {
    user.instagram = {};
    user.instagram.id    = profile.id;
    user.instagram.token = token;
    user.instagram.tokenSecret = tokenSecret;

    user.save().then((user) => {
      api
        .updateInstagramSubs(user)
        .then(() => {
          return done(null, user);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  }

};