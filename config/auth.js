// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
    development: {

    'facebookAuth' : {
      'clientID'    : '668487066691859', // your App ID
      'clientSecret'  : '36be87468a221ee932f4fa43bd7df2ee', // your App Secret
      'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
      'consumerKey'     : 'Ebrb5Zc5aAqL0i0pojtcsS2w7',
      'consumerSecret'  : 'eO991SsR1KLxV4JvT0AyYIx61zP4oObCCWemBqJ0UXh7e9Fa5S',
      'callbackURL'     : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
      'clientID'    : 'your-secret-clientID-here',
      'clientSecret'  : 'your-client-secret-here',
      'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }
  },
  production: {

    'facebookAuth' : {
      'clientID'    : '668487066691859', // your App ID
      'clientSecret'  : '36be87468a221ee932f4fa43bd7df2ee', // your App Secret
      'callbackURL'   : 'http://flavioba.capella.uberspace.de/auth/facebook/callback'
    },

    'twitterAuth' : {
      'consumerKey'     : 'Ebrb5Zc5aAqL0i0pojtcsS2w7',
      'consumerSecret'  : 'eO991SsR1KLxV4JvT0AyYIx61zP4oObCCWemBqJ0UXh7e9Fa5S',
      'callbackURL'     : 'http://flavioba.capella.uberspace.de/auth/twitter/callback'
    },

    'googleAuth' : {
      'clientID'    : 'your-secret-clientID-here',
      'clientSecret'  : 'your-client-secret-here',
      'callbackURL'   : 'http://flavioba.capella.uberspace.de/auth/google/callback'
    }
  }
};