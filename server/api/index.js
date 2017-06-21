// API does everything that has to do with creating/updating/deleting data stored in the database
// it uses external APIs to fetch data for the user such as predictions, subscriptions or feed data

// TODO: it should be a bit more structured/modularized into specific concerns
// TODO: it should be responsible for initially creating the users and linking new accounts

const _ = require('lodash');
const fbApi = require('../external/fb');
const amsApi = require('../external/ams');
const twitterApi = require('../external/twitter');
const youtubeApi = require('../external/youtube');
const instagramApi = require('../external/instagram');
const log = require('../../log');


module.exports.fetchPredictions = (user) => {
  return fbApi
    .fetchRankedSubs(user)
    // then fetch the facebook likes
    .then((subs) => {
      let hasNewItems = !_.isEqual(user.facebook.subs.sort(), subs.sort());
      // if there are new like items, save them and get new prediction
      if(hasNewItems) {
        user.facebook.subs = subs;
        return user.save()
          .then(() => {
            return amsApi.getPrediction(user);
          });
      // if there are no new like items but no prediction yet, get prediction
      } else if(!user.predictions) {
        return amsApi.getPrediction(user);
      } else {
        return Promise.resolve(user.predictions);
      }
    })
    .then((predictions) => {
      user.predictions = predictions;
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
  return twitterApi.fetchTweets(user)
    .then((tweets) => {
      console.log(tweets);
    })
    .catch((err) => {
      log.red("Twitter predictions fail");
      console.log(err);
    });
}

module.exports.updateTwitterSubs = (user) => {
  return twitterApi.fetchRankedSubs(user)
    .then((subs) => {
      user.twitter.subs = subs;
      return user.save();
    });
}

module.exports.updateYoutubeSubs = (user) => {
  return youtubeApi.fetchRankedSubs(user)
    .then((subs) => {
      user.youtube.subs = subs;
      return user.save();
    });
}

module.exports.updateInstagramSubs = (user) => {
  return instagramApi.fetchRankedSubs(user)
    .then((subs) => {
      user.instagram.subs = subs;
      return user.save();
    });
}