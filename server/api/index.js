// API does everything that has to do with creating/updating/deleting data stored in the database
// it uses external APIs to fetch data for the user such as predictions, subscriptions or feed data

// TODO: it should be a bit more structured/modularized into specific concerns
// TODO: it should be responsible for initially creating the users and linking new accounts

const _ = require('lodash');
const amsApi = require('../external/ams');
const log = require('../../log');
const User = require('../models/user');
const { getConnectedPlatforms } = require('../util');

const platformApis = {
  facebook: require('../external/fb'),
  twitter: require('../external/twitter'),
  youtube: require('../external/youtube'),
  instagram: require('../external/instagram')
}

// Fetching the main feed for a profile
const fetchFeed = (user) => {
  let promises = _.map(getConnectedPlatforms(user), platform => {
    return platformApis[platform.id].fetchFeed(user, 20)
  });
  return Promise.all(promises)
    .then(items => _(items).flatten(items).shuffle());
}

const getCombinedSubs = (user) =>
  _.chain(getConnectedPlatforms(user))
    .map((platform) => 
      user[platform.id].subs.map(({id, relevance, name, thumb, username}) => (
        {id, relevance, name, thumb, username, platform: platform.id}
      ))
    )
    .flatten()
    .value();


module.exports.fetchPredictions = (user) => {
  return platformApis.facebook
    .fetchRankedSubs(user)
    // then fetch the facebook likes
    .then((subs) => {
      user.facebook.subs = subs;
      console.log("getting predictions");
      return amsApi.getPrediction(user);
    })
    .then((predictions) => {
      console.log("got predictions");
      user.predictions = predictions;
      console.log("saving predictions");
      return user.save().then(() => {
        return predictions;
      });
    })
    .catch((err) => {
      log.red("Predictions fail");
      console.log(err);
    });
}

module.exports.fetchTwitterPredictions = (user) => {
  return platformApis.twitter.fetchTweets(user)
    .then((tweets) => {
      console.log(tweets);
    })
    .catch((err) => {
      log.red("Twitter predictions fail");
      console.log(err);
    });
}

module.exports.fetchProfile = (profileId) => {
  return User.findOne({_id: profileId })
    .then(user => {
      return fetchFeed(user)
        .then(feed => {
          return {
            id: user.id,
            predictions: user.predictions,
            subs: getCombinedSubs(user),
            platforms: getConnectedPlatforms(user),
            feed: feed
          }
        })
    });
}

/*module.exports.fetchProfile = (profileId) => {
  return User.findOne({_id: profileId })
    .then(user => {
      return {
        id: user.id,
        predictions: user.predictions,
        subs: getCombinedSubs(user),
        platforms: getConnectedPlatforms(user),
        feed: []
      }
    });
}*/

// UPDATING SUBS
module.exports.updateTwitterSubs = (user) => {
  return platformApis.twitter.fetchRankedSubs(user)
    .then((subs) => {
      user.twitter.subs = subs;
      return user.save();
    });
}

module.exports.updateYoutubeSubs = (user) => {
  return platformApis.youtube.fetchRankedSubs(user)
    .then((subs) => {
      user.youtube.subs = subs;
      return user.save();
    });
}

module.exports.updateInstagramSubs = (user) => {
  return platformApis.instagram.fetchRankedSubs(user)
    .then((subs) => {
      user.instagram.subs = subs;
      return user.save();
    });
}