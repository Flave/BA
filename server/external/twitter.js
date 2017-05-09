const _ = require('lodash');
const log = require('../../log');
const Promise = require('promise');
const axios = require('axios');
const querystring = require('querystring');
const Twitter = require('twitter');
const twitterAuth = require('../../config/auth')[process.env.NODE_ENV].twitterAuth;

const fetchTweets = (user) => {
  let likes = [];
  let baseUri = 'https://api.twitter.com/1.1/statuses/user_timeline.json?';
  let opts = {
    count: 100,
    user_id: user.twitter.id,
    trim_user: true,
    exclude_replies: true,
    include_rts: false
  }

  let client = new Twitter({
    consumer_key: twitterAuth.consumerKey,
    consumer_secret: twitterAuth.consumerSecret,
    access_token_key: user.token,
    access_token_secret: user.tokenSecret
  });

  return new Promise((success, failure) => {
    client.get('statuses/user_timeline', opts, (err, tweets, response) => {
      if(err)
        failure(err);
      else
        success(tweets);
    });
  });
}

module.exports = {
  fetchTweets
}