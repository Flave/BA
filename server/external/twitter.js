const _ = require('lodash');
const d3Array = require('d3-array');
const log = require('../../log');
const Promise = require('promise');
const axios = require('axios');
const Twitter = require('twitter');
const twitterAuth = require('../../config/auth')[process.env.NODE_ENV].twitterAuth;

const fetchRankedSubs = (user) => {
  const favsWeight = 1;
  const followersWeight = 1;

  return Promise.all([fetchSubscriptions(user), fetchFavs(user)])
    .then(responses => {
      let favsExtent, favsMax, followersExtent, favsDelta, followersDelta;
      let [subscriptions, favs] = responses;
      const favsByUser = sortFavsByUser(favs, subscriptions);

      // get extents and deltas for score calculation
      favsMax = d3Array.max(favsByUser, sub => sub.count);
      favsExtent = [0, favsMax];
      followersExtent = d3Array.extent(subscriptions, sub => sub.followers_count);
      favsDelta = favsExtent[1] - favsExtent[0];
      followersDelta = followersExtent[1] - followersExtent[0];
      return _.chain(subscriptions)
        .forEach(sub => {
          const favs = _.find(favsByUser, {id: sub.id_str}) || {count: 0};
          sub.favsCount = favs.count;
          sub.favsScore = (favs.count - favsExtent[0]) / favsDelta;
          sub.followersScore = (sub.followers_count - followersExtent[0]) / followersDelta;
          sub.relevance = (sub.favsScore + sub.followersScore) / (favsWeight + followersWeight);
        })
        .sortBy(['relevance'])
        .reverse()
        .map(sub => (
          {
            id: sub.id_str,
            username: sub.screen_name,
            name: sub.name,
            relevance: sub.relevance,
            thumb: sub.profile_image_url
          }
        ))
        .value();
    })
    .catch(err => console.log(err));
}

const rankSubscriptions = () => {

}

// group the favorites by user and rank the users by amount of likes
const sortFavsByUser = (favs, subscriptions) => (
  _.chain(favs)
    .filter(fav => _.find(subscriptions, {id_str: fav.user.id_str}))
    .groupBy('user.id_str')
    .sortBy(['length'])
    .reverse()
    .map(favGroup => ({count: favGroup.length, id: favGroup[0].user.id_str}))
    .value()
)

const fetchSubscriptions = user => {
  let subs = [];
  const MAX_SUBS = 1000;
  let opts = {
    count: 200,
    user_id: user.twitter.id,
    skip_status: true,
    include_user_entities: false
  }

  const fetchSubscriptionsBatch = (cursor) => {
    opts.cursor = cursor;

    return apiRequest(user, 'friends/list', opts)
      .then(subsBatch => {
        subs = subs.concat(subsBatch.users)
        if(subsBatch.next_cursor_str === '0' || subs.length >= MAX_SUBS) {
          return subs;
        }

        return fetchSubscriptionsBatch(subsBatch.next_cursor_str);
      });
  }

  return fetchSubscriptionsBatch()
}

// { "errors": [ { "code": 88, "message": "Rate limit exceeded" } ] } 

// https://dev.twitter.com/rest/reference/get/favorites/list
const fetchFavs = (user) => {
  const opts = {
    count: 200,
    user_id: user.twitter.id,
    include_entities: false
  }

  return apiRequest(user, 'favorites/list', opts);
}


const fetchFeed = (user, count) => {
  return fetchHomeTimeline(user, count)
    .then(tweets => {
      return _(tweets)
      // QUESTION: Should some filtering take place if a tweet is only a retweet (determined by tweet.retweeted_status)?
      // QUESTION: How should sorting happen if a tweet is a retweet?
      .sort(tweet => _.findIndex(user.twitter.subs, {id: tweet.user.id_str}))
      .reverse()
      .map(tweet => {
        let sub = _.find(user.twitter.subs, {id: tweet.user.id_str})
        return {
          platform: 'twitter',
          id: tweet.id_str
        }
      })
      .value();
    });
}

const fetchHomeTimeline = (user, count) => {
  const opts = {
    count: count,
    trim_user: true,
    user_id: user.twitter.id,
    exclude_replies: true,
    include_entities: false
  }

  return apiRequest(user, 'statuses/home_timeline', opts);  
}

const apiRequest = (user, endpoint, options) => {
  let client = new Twitter({
    consumer_key: twitterAuth.consumerKey,
    consumer_secret: twitterAuth.consumerSecret,
    access_token_key: user.twitter.token,
    access_token_secret: user.twitter.tokenSecret
  });

  return new Promise((success, failure) => {
    client.get(endpoint, options, (err, data, response) => {
      if(err) failure(err);
      success(data);
    });
  })
}

module.exports = {
  fetchRankedSubs,
  fetchFeed
}