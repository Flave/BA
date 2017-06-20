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

module.exports = {
  fetchLiked
}
