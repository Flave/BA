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

    'youtubeAuth' : {
      'clientID'    : '857220500454-9jn970oo0p9mg46obsoluj2loh91q8jf.apps.googleusercontent.com',
      'clientSecret'  : 'v65JjLv1TSLjtreL3_OajpCg',
      'callbackURL'   : 'http://localhost:8080/connect/youtube/callback'
    },
    'instagramAuth' : {
      'clientID'    : 'a9310c9330b742a4bf37f33fba868283',
      'clientSecret'  : 'c998f0640dd94f9e8a79c0819561cf32',
      'callbackURL'   : 'http://localhost:8080/connect/instagram/callback'
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

    'youtubeAuth' : {
      'clientID'    : '857220500454-nheu8d83hv076le1gk7bb7m746kl218i.apps.googleusercontent.com',
      'clientSecret'  : 'aW4iPuGz2iohPxjeewo3owyQ',
      'callbackURL'   : 'http://flavioba.capella.uberspace.de/connect/youtube/callback'
    },
    'instagramAuth' : {
      'clientID'    : 'a9310c9330b742a4bf37f33fba868283',
      'clientSecret'  : 'c998f0640dd94f9e8a79c0819561cf32',
      'callbackURL'   : 'http://flavioba.capella.uberspace.de/connect/instagram/callback'
    }
  }
};