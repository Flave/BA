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
          id: sub.snippet.resourceId.channelId,
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
      fields: "nextPageToken,items(snippet(title,resourceId(channelId),thumbnails(default(url))))",
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

const fetchFeed = (user, count) => {
  const allSubs = user.youtube.subs;
  const subs = allSubs.length <= count ? allSubs : allSubs.slice(0, 2);
  const subsPromises = _.map(subs, sub => (
    fetch(user, 'search', 'list', {
        part: 'snippet',
        channelId: sub.id,
        maxResults: 1,
        fields: 'items(id(videoId))',
        order: 'date',
        headers: {}
    })
  ));

  return Promise.all(subsPromises).then(responses => {
    return _(responses).map(response => {
      if(!response.items.length) return;
      return {
        id: response.items[0].id.videoId,
        platform: "youtube"
      };
    })
    .compact()
    .value();

  })
  .catch(err => console.log(err));
}


const fetch = (user, ressource, operation, opts) => {
  let oauth2Client = new OAuth2();
  let client = google.youtube({ version: 'v3',auth: oauth2Client })[ressource][operation];
  oauth2Client.credentials = {
      access_token: user.youtube.token,
      refresh_token: user.youtube.refreshToken
  };

  return new Promise((success, failure) => {
    client(opts, function(err, data, response) {
        if (err) {
          if(err.code === 401) {
            console.log("getting new toookens");
            oauth2Client.refreshAccessToken(function(err, tokens) {
              console.log(err);
              console.log(tokens);
              // your access_token is now refreshed and stored in oauth2Client 
              // store these new tokens in a safe place (e.g. database) 
            });
          //failure(err);
          }
        }
        if (data)
          success(data);
  /*      if (response) {
            console.log('Status code: ' + response.statusCode);
        }*/
    });
  });
}

module.exports = {
  fetchRankedSubs,
  fetchFeed
}