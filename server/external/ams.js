const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const secrets = require('./secrets.json');
const traits = "BIG5,Satisfaction_Life,Intelligence,Age,Female,Politics,Religion,Relationship";
const uid = 1111111111; //e.g. 4 is Mark Zuckerberg's unique Facebook ID
const log = require('../../log');
const _ = require('lodash');

// slightly hacky way to group predictions into groups of demographics, big5, politics and religion
const processPredictions = (rawPredictions) => (
  _.map(rawPredictions, (prediction) => (
      {
        id: prediction.trait.toLowerCase(),
        value: prediction.value
      }
    )
  )
)

const getPrediction = (user) => {
  var args = {
    body: _.map(user.facebook.subs, 'id'),
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

  return new Promise(function (fulfill, reject){
    return request(args).then((response) => {
      if(response.statusCode === 204) {
        log.red("No prediction could be made based on like ids provided.");
        fulfill(null);
        return;
      }
      log.rainbow("Got predictions");
      fulfill(processPredictions(response.body.predictions));
    })
    .catch((err) => {
      if(err.statusCode === 403) {
        log.red("Authtoken expired, get new token!");
        getNewToken()
          .then(getPrediction.bind(null, user))
          .then((predictions) => {
            fulfill(processPredictions(response.body.predictions));
          });
      } else {
        log.red("Getting predictions failed!");
        console.log(err);
        reject(err.message);
      }
    });

    fs.readFile(filename, enc, function (err, res){
      if (err) reject(err);
      else fulfill(res);
    });
  });


}


function getNewToken() {
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
  log.blue('Starting token request');
  return request(args).then((response) => {
    log.blue('Got token');
    secrets.token = response.body.token;
    saveData(secrets, "secrets");
  })
  .catch((err) => {
    log.red("Didn't get token");
    console.log(err);
  });
}

function saveData(data, name) {
  fs.writeFile(path.resolve(__dirname, name + ".json"), JSON.stringify(data, null, 2));
}

module.exports = {getPrediction};