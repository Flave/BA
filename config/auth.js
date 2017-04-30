// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
    development: {

    'facebookAuth' : {
      'clientID'    : '1754125368233773', // your App ID
      'clientSecret'  : '0f9450749b9c04ec1d6c3cd27abcb907', // your App Secret
      'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
      'consumerKey'     : 'Whn98xNG0nEZNHXh6yCLhBTJv',
      'consumerSecret'  : 'jEUbZ79RiZ0cMRk5r4r4NgkfMge4bC3cZn8qwoBQx1kXOeboe1',
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
      'clientID'    : '1754125368233773', // your App ID
      'clientSecret'  : '0f9450749b9c04ec1d6c3cd27abcb907', // your App Secret
      'callbackURL'   : 'http://flavioba.capella.uberspace.de/auth/facebook/callback'
    },

    'twitterAuth' : {
      'consumerKey'     : 'Whn98xNG0nEZNHXh6yCLhBTJv',
      'consumerSecret'  : 'jEUbZ79RiZ0cMRk5r4r4NgkfMge4bC3cZn8qwoBQx1kXOeboe1',
      'callbackURL'     : 'http://flavioba.capella.uberspace.de/auth/twitter/callback'
    },

    'googleAuth' : {
      'clientID'    : 'your-secret-clientID-here',
      'clientSecret'  : 'your-client-secret-here',
      'callbackURL'   : 'http://flavioba.capella.uberspace.de/auth/google/callback'
    }
  }
};