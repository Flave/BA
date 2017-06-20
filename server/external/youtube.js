const _ = require('lodash');
const log = require('../../log');
const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const axios = require('axios');
const youtubeAuth = require('../../config/auth')[process.env.NODE_ENV].youtubeAuth;


// Fetch subscriptions

// https://developers.google.com/youtube/v3/docs/

const fetchSubscriptions = (user) => {
  var oauth2Client = new OAuth2();
  oauth2Client.credentials = {
      access_token: user.youtube.token,
      refresh_token: user.youtube.token
  };

  google.youtube({
      version: 'v3',
      auth: oauth2Client
  }).subscriptions.list({
      part: 'snippet',
      mine: true,
      fields: "items(snippet(title%2C+channelId%2Cthumbnails%2Fdefault%2Furl))",
      headers: {}
  }, function(err, data, response) {
      if (err) {
          console.error('Error: ' + err);
          res.json({
              status: "error"
          });
      }
      if (data) {
          console.log(data);
/*          res.json({
              status: "ok",
              data: data
          });*/
      }
/*      if (response) {
          console.log('Status code: ' + response.statusCode);
      }*/
  });
}

module.exports = {
  fetchSubscriptions
}