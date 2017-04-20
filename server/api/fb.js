const request = require('request-promise-native');
const _ = require('lodash');
const colors = require('../../colorlog');
const Promise = require('promise');

const fetchLikes = (user) => {
  let likes = [];
  let startUri = 'https://graph.facebook.com/v2.8/me?fields=likes{id}&access_token=' + user.facebook.token;

  const finishFetching = (likes) => {
    likes = _.map(likes, 'id');
    let hasNewItems = !_.isEqual(user.facebook.likes.sort(), likes.sort());
    if(hasNewItems) {
      user.facebook.likes = likes;
      return user.save();
    } else {
      return Promise.resolve(true);
    }
  }

  const fetchLikesBatch = (batchUri) => {
    let opts = {
      uri: batchUri,
      json: true
    }

    if(batchUri) {
      return request(opts)
        .then((response) => {
          // for some reason there is a last batch which is empty
          if(!response.likes && !response.data.length)
            return _.map(likes, 'id');

          const likesBatch = response.likes ? response.likes.data : response.data;
          const nextUri = response.likes ? response.likes.paging.next : response.paging.next;

          likes = likes.concat(likesBatch);
          return fetchLikesBatch(nextUri);
        })
        .catch((err) => {
          colors.red(err);
        });        
    } else {
      return _.map(likes, 'id');
    }
  }

  return fetchLikesBatch(startUri);
}


module.exports = {
  fetchLikes
}