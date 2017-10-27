const Auth = require('./auth');
const Client = require('./client');
const Request = require('request');
const _ = require('underscore');
const debug = require('debug')('libbeacon:main');


module.exports = function(client_id, client_secret, environment='prod') {
  const auth = Auth(client_id, client_secret, environment);

  return {
    login(username, password, cb)
    {
        auth.getToken(username, password).then((token) => {
          cb && cb(null,new Client(token, environment));
        }, (error) => {
          console.log(error)
          cb && cb(error)
        }).catch(function (e) {
     console.log("Promise Rejected", e);
      });
    }
  };
};
