const request = require('request-promise-native');
const _ = require('lodash');
const colors = require('colors');
const Promise = require('promise');
const axios = require('axios');
const d3Array = require('d3-array');


// First batch
//
// {
//   likes: {
//     data: [{page}]
//   },
//   paging: {
//     next: url
//   }
// }

// Subsequent batches
//
// {
//   data: [{page}],
//   paging: {
//     next: url,
//     previous: url
//   }
// }

const fetchRankedSubs = (user) => {
  let pages = [];
  let startUri = 'https://graph.facebook.com/v2.8/me?fields=likes.limit(10){id,fan_count,posts.limit(3)}&access_token=' + user.facebook.token;

  const fetchPagesBatch = (batchUri) => {
    let opts = {
      uri: batchUri,
      json: true
    }

    if(batchUri) {
      return request(opts)
        .then((response) => {
          // for some reason there is a last batch which is empty
          if(!response.likes && !response.data.length)
            return pages;

          const pagesBatch = response.likes ? response.likes.data : response.data;
          const nextUri = response.likes ? response.likes.paging.next : response.paging.next;
          console.log("===> BATCH ")
          pages = pages.concat(pagesBatch);
          return fetchPagesBatch(nextUri);
        })
        .catch((err) => {
          console.log(err);
        });        
    } else {
      return pages;
    }
  }

  return fetchPagesBatch(startUri)
    .then(pages => {
      return rankPages(pages);
    })
    .catch(err => console.log(err));
}


const rankPages = (pages) => {
  const currencyWeight = 1;
  const popularityWeight = 1;

  // filter out all the pages that don't post and
  // set the idleness of the pages
  pages = _.filter(pages, 'posts');
  _.forEach(pages, setAbsoluteIdleness);

  const fanCountExtent = d3Array.extent(pages, page => page.fan_count);
  const absoluteIdlenessExtent = d3Array.extent(pages, page => page.absolute_idleness);
  const fanCountDelta = fanCountExtent[1] - fanCountExtent[0];
  const absoluteIdlenessDelta = absoluteIdlenessExtent[1] - absoluteIdlenessExtent[0];

  return _.chain(pages)
    .forEach((page, i) => {
      const {absolute_idleness, fan_count} = page;
      page.currency = 1 - (absolute_idleness - absoluteIdlenessExtent[0]) / absoluteIdlenessDelta;
      page.popularity = (fan_count - fanCountExtent[0]) / fanCountDelta;
      page.relevance = (page.currency + page.popularity) / (currencyWeight + popularityWeight);
    })
    .sortBy(['relevance'])
    .reverse()
    .map(({id, relevance}) => ({id, relevance}))
    .value();
}

// The absolute idleness determines how active a page is
const setAbsoluteIdleness = (page) => {
  const now = new Date();
  const {data} = page.posts;
  const total = _.reduce(data, (total, post) => {
    return total + (now - new Date(post.created_time))
  }, 0);
  page.absolute_idleness = total / data.length;
}


const fetchLikes = (user) => {
  let likes = [];
  let startUri = 'https://graph.facebook.com/v2.8/me?fields=likes{id,fan_count}&access_token=' + user.facebook.token;
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
  let likeIds = _.map(user.facebook.subs.slice(0, 1), 'id').toString();
  // DOC Multiple ID Read Requests: https://developers.facebook.com/docs/graph-api/using-graph-api
  // DOC /post: https://developers.facebook.com/docs/graph-api/reference/v2.9/post/
  let startUri = `https://graph.facebook.com/v2.8/posts?access_token=${user.facebook.token}&limit=1&fields=permalink_url,type,privacy&ids=${likeIds}`;

  return request({
    uri: startUri,
    json: true
  })
  .then((response) => {
    return _(response).map(posts => {
      if(!posts.data.length) return;
      const privacy = posts.data[0].privacy.value;
      if(privacy === 'EVERYONE' || privacy === '') {
        return {
          url: posts.data[0].permalink_url
        };
      }
    })
    .compact()
    .value();
  })
  .catch(err => console.log(err));
}




module.exports = {
  fetchLikes,
  fetchRankedSubs,
  fetchFeed
}