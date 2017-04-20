module.exports = {
  dbUri: "mongodb://flavio_mongoadmin:fuF6yeere3@95.143.172.227/test",
  jwtSecret: "something really complex",

  facebookAuth : {
    clientID    : '1754125368233773', // your App ID
    clientSecret  : '0f9450749b9c04ec1d6c3cd27abcb907', // your App Secret
    callbackURL   : 'http://localhost:8080/auth/facebook/callback'
  },

  twitterAuth : {
    consumerKey     : 'Whn98xNG0nEZNHXh6yCLhBTJv',
    consumerSecret  : 'jEUbZ79RiZ0cMRk5r4r4NgkfMge4bC3cZn8qwoBQx1kXOeboe1',
    callbackURL     : 'http://localhost:8080/auth/twitter/callback'
  }  
}