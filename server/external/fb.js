const request = require('request-promise-native');
const _ = require('lodash');
const colors = require('colors');
const Promise = require('promise');
const axios = require('axios');

const fetchLikes = (user) => {
  let likes = [];
  let startUri = 'https://graph.facebook.com/v2.8/me?fields=likes{id}&access_token=' + user.facebook.token;
  colors.blue('Fetching likes');
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

const fetchFeed = (user) => {
  let likeIds = user.facebook.likes.slice(0, 2).toString();
  let startUri = `https://graph.facebook.com/v2.8/posts?access_token=${user.facebook.token}&limit=1&fields=permalink_url&ids=${likeIds}`;

  return request({
    uri: startUri,
    json: true
  })
  .then((response) => {
    const promises = _.map(response, post => {
      return axios.get(`https://www.facebook.com/plugins/post/oembed.json/?url=${post.data[0].permalink_url}&omitscript=true`);
    });
    return Promise.all(promises)
  })
  .then((responses) => {
    responses = _.map(responses, (response) => response.data);
    return responses;
  })
  .catch(err => colors.red('Feed fail'))
}

module.exports = {
  fetchLikes,
  fetchFeed
}

