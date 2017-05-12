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
  let likeIds = user.facebook.likes.slice(0, 4).toString();
  // DOC Multiple ID Read Requests: https://developers.facebook.com/docs/graph-api/using-graph-api
  // DOC /post: https://developers.facebook.com/docs/graph-api/reference/v2.9/post/
  let startUri = `https://graph.facebook.com/v2.8/posts?access_token=${user.facebook.token}&limit=1&fields=permalink_url,type&ids=${likeIds}`;

  return request({
    uri: startUri,
    json: true
  })
  .then((response) => {
    return _(response).map(posts => {
      if(!posts.data.length) return;
      console.log(posts.data);
      return {
        url: posts.data[0].permalink_url
      };
    })
    .compact()
    .value();
  })
  .catch(err => console.log(err));
}

module.exports = {
  fetchLikes,
  fetchFeed
}



/*{ 
  '100440753329511': 
  { data: [ [Object] ],
    paging: 
    { 
      cursors: [Object],
      next: 'https://graph.facebook.com/v2.9/100440753329511/posts?access_token=EAAJfZCEYlqRMBAH7wLVLa9vfZAK0z2p4eidyo6SyBDslZC9jh3CF8a7noipm8NOXHqn9jwgEpsluW7Q0IiZB7D6EzjZA18fGij2RVnZCEIdwGaSr6E1jAUEXTLI4lvDIwGUzHd837Y6NZAOtZB3CRAXZAZA7jnscIxZCdEZD&fields=permalink_url&limit=1&after=Q2c4U1pXNTBYM0YxWlhKNVgzTjBiM0o1WDJsa0R5UXhNREEwTkRBM05UTXpNamsxTVRFNkxURXpNRGN3TXpjeU5ETXpOemt6TXpBMk1USVBER0ZA3YVY5emRHOXllVjlwWkE4ZA01UQXdORFF3TnpVek16STVOVEV4WHpFMk5EZAzVOREl5TWpVeE5EWXdNVFVQQkhScGJXVUdXUWRHeEFFPQZDZD' 
    } 
  },
  '103155833057501': { data: [] }
}*/