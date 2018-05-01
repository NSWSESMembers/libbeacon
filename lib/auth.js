const oauth2 = require('simple-oauth2');
const c = require('./constants');
const debug = require('debug')('libbeacon:auth');

module.exports = function(
  client_id, client_secret, environment='prod',
) {
  const credentials = {
    client: {
      id: client_id,
      secret: client_secret,
    },
    auth: {
      tokenHost: c.environments[environment].identity_url,
      tokenPath: '/core/connect/token',
      authorizePath: '/core/connect/authorize',
    },
  };

  const api = oauth2.create(credentials);

  return {
    getToken: (username, password) => {
      return new Promise((resolve, reject) => {
        const tokenConfig = {
          username: username,
          password: password,
          scope: c.environments[environment].oauth_scope,
        };

        api.ownerPassword.getToken(tokenConfig)
        .then((result) => {
          debug('Successful auth: ', result);
          resolve(api.accessToken.create(result));
        })
        .catch((error) => {
          debug('Auth fail: ', error);
          reject(Error('Access token error: ' + error.message));
        });
      });
    },
  };
};
