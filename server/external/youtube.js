const _ = require('lodash');
const log = require('../../log');
const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const Promise = require('promise');
const youtubeAuth = require('../../config/auth')[process.env.NODE_ENV].youtubeAuth;


/*
  HOW YOU SHOULD DO THE RESPONSES N STUFF!
  res.json({
      status: "ok",
      data: data
  });
*/

// Fetch subscriptions
// https://developers.google.com/youtube/v3/docs/

// Youtube API returns subscriptions already ordered by relevance AWWWESOME!
const fetchRankedSubs = (user) => {
  return fetchSubs(user)
    .then((subs) => {
      return _.map(subs, sub => {
        return {
          name: sub.snippet.title,
          id: sub.snippet.channelId,
          thumb: sub.snippet.thumbnails.default.url
        }
      });
    })
    .catch((err) => console.log(err));
}

const fetchSubs = (user) => {
  let items = [];
  const maxItems = 500;
  let opts = {
      part: 'snippet',
      mine: true,
      maxResults: 50,
      fields: "nextPageToken,items(snippet(title,channelId,thumbnails(default(url))))",
      headers: {}
  }

  const fetchItemsBatch = (nextPageToken) => {
    opts.pageToken = nextPageToken;

    return fetch(user, 'subscriptions', 'list', opts)
      .then((response) => {
        items = items.concat(response.items);
        if(!response.nextPageToken || items.length >= maxItems)
          return items;
        return fetchItemsBatch(response.nextPageToken);
      });
  }
  return fetchItemsBatch();
}

const fetchPlaylists = (user) => {
  return fetch(user, 'channels', 'list', {
      part: 'contentDetails',
      mine: true,
      fields: "items(contentDetails(relatedPlaylists(likes,favorites,watchLater,watchHistory)))",
      headers: {}
  });
}

const fetchPlaylist = (user, id) => {
  let items = [];
  const maxItems = 500;
  let opts = {
      part: 'snippet',
      playlistId: id,
      fields: 'nextPageToken,items(snippet(channelId,publishedAt))',
      headers: {}
  }

  const fetchItemsBatch = (nextPageToken) => {
    opts.nextPageToken = nextPageToken;

    fetch(user, 'playlistItems', 'list', opts)
      .then((response) => {
        items.concat(response.items);
        if(!response.nextPageToken || items.length >= maxItems)
          return items;
        return fetchItemsBatch(response.nextPageToken);
      });
  }

  return fetchItemsBatch();
}


const fetch = (user, ressource, operation, opts) => {
  let oauth2Client = new OAuth2();
  let client = google.youtube({ version: 'v3',auth: oauth2Client })[ressource][operation];
  oauth2Client.credentials = {
      access_token: user.youtube.token,
      refresh_token: user.youtube.token
  };

  return new Promise((success, failure) => {
    client(opts, function(err, data, response) {
        if (err)
            failure(err);
        if (data)
          success(data);
  /*      if (response) {
            console.log('Status code: ' + response.statusCode);
        }*/
    });
  });
}

module.exports = {
  fetchRankedSubs
}