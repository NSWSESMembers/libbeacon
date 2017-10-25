const Auth = require('./auth');
const Client = require('./client');
const Request = require('request');
const _ = require('underscore');
const debug = require('debug')('libbeacon:main');


module.exports = function(client_id, client_secret, environment='prod') {
  const auth = Auth(client_id, client_secret, environment);

  return {
    login: (username, password) => {
      return new Promise((resolve, reject) => {
        auth.getToken(username, password).then((token) => {
          resolve(new Client(token, environment));
        }, (error) => {
          reject(error);
        });
      });
    }
  };
};

