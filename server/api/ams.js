const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
// secrets format: { "customer_id": 1111, "api_key": "string", "token": "" }
var secrets = require('./secrets.json');
var traits = "BIG5,Satisfaction_Life,Intelligence,Age,Female,Gay,Lesbian,Concentration,Politics,Religion,Relationship";
var uid = 1111111111; //e.g. 4 is Mark Zuckerberg's unique Facebook ID
const colors = require('../../colorlog');


const getPrediction = (user) => {
  var args = {
    body: user.facebook.likes,
    headers: {
      "X-Auth-Token": secrets.token,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    uri: "http://api-v2.applymagicsauce.com/like_ids?interpretations=true&contributors=true&traits=" + traits + "&uid=" + uid,
    method: 'POST',
    json: true,
    resolveWithFullResponse: true
  };

  return request(args).then((response) => {
    if(response.statusCode === 204)
      console.log("No prediction could be made based on like ids provided.");
    return response.body.predictions;
  })
  .catch((err) => {
    if(err.statusCode === 403) {
      colors.red("Authtoken expired, get new token!");
      getNewToken(getPrediction.bind(null, user));
    }
  });
}


function getNewToken(callback) {
  var args = {
    body: {
      "customer_id": secrets.customer_id,
      "api_key": secrets.api_key
    },
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    method: 'POST',
    uri: 'http://api.applymagicsauce.com/auth',
    json: true,
    resolveWithFullResponse: true
  };
  colors.blue('Starting request');
  request(args).then((response) => {
    colors.blue('Got token');
    secrets.token = response.body.token;
    callback();
    console.log(response.body);
    saveData(secrets, "secrets");
  })
  .catch((err) => {
    colors.red("Didn't get token");
    console.log(err);
  });
}

function saveData(data, name) {
  fs.writeFile(path.resolve(__dirname, name + ".json"), JSON.stringify(data, null, 2));
}

module.exports = {getPrediction};