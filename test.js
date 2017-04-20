/*var Promise = require('promise');

const request = () => {
  return new Promise((fulfill, reject) => {
    setTimeout(() => {
      fulfill('fulfillment');
    }, 1000)
  });
}

const fetch = () => {
  return request()
    .then((val) => {
      return val;
    })
    .catch(() => {
      console.log('goone wroong');
    })
}

fetch()
  .then((val) => {
    console.log(val)
    return fetch();
  })
  .then((val) => {
    console.log(val);
  })*/


var fs = require('fs');

let secrets = {
  "customer_id": 3009,
  "api_key": "bajsf4nb8gr5e40iukmr03ashe",
  "token": "bla"
}

fs.writeFile("secretss.json", JSON.stringify(secrets, null, 2));