const _ = require('lodash');
const log = require('../../log');
const Promise = require('promise');
const axios = require('axios');


// Fetch subscriptions

const fetchLiked = (user) => {
  let favs = [];
        const baseUri = "https://api.instagram.com/v1/users/self/media/liked";
        const opts = {
          params: {
            access_token: user.instagram.token
          }
        }
        log.rainbow("FETCHING liked");
        return axios.get(baseUri, opts)
          .then(response => {
            log.rainbow("GOT liked");
            console.log(response.data);
          })
          .catch(err => {
            console.log(err);
          });
}

const fetchRankedSubs = (user) => {
  let favs = [];
  const baseUri = "https://api.instagram.com/v1/users/self/follows";
  const opts = {
    params: {
      access_token: user.instagram.token
    }
  }

  return axios.get(baseUri, opts)
    .then(response => {
      log.rainbow("GOT subs");
      return _.map(response.data.data, sub => ({
        name: sub.full_name,
        username: sub.username,
        id: sub.id,
        thumb: sub.profile_picture,
        relevance: 0.5
      }));
    })
    .catch(err => {
      console.log(err);
    });
}

const fetchFeed = (user, count) => {
  const subs = user.instagram.subs.length <= count ? user.instagram.subs : user.instagram.subs.slice(0, 5);
  const opts = {
    params: {
      access_token: user.instagram.token,
      count: 1
    }
  }

  const promises = _.map(subs, sub => axios.get("https://api.instagram.com/v1/users/" + sub.id + "/media/recent", opts))
  return Promise.all(promises)
    .then(responses =>
      _.map(responses, response => (
        {
          id: response.data.data[0].link,
          platform: "instagram"
        }
      ))
    )
    .catch(err => console.log("Youtube", err));
}

module.exports = {
  fetchRankedSubs,
  fetchFeed
}
