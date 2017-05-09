const _ = require('lodash');
const fbApi = require('../external/fb');
const amsApi = require('../external/ams');
const twitterApi = require('../external/twitter');
const log = require('../../log');

module.exports.fetchPredictions = (user) => {
  return fbApi
    .fetchLikes(user)
    // then fetch the facebook likes
    .then((likes) => {
      let hasNewItems = !_.isEqual(user.facebook.likes.sort(), likes.sort());
      // if there are new like items, save them and get new prediction
      if(hasNewItems) {
        user.facebook.likes = likes;
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

module.exports.fetchFeed = (user) => {
  
}