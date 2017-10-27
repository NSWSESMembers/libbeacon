const c = require('./constants');
const Request = require('request');
const _ = require('underscore');
const debug = require('debug')('libbeacon:client');


class Client {
  constructor(token, environment) {
    debug('Initialize Client with token: ', token);
    this._token = token;
    this.environment = environment;
    this.cookie = ''
    this.sessionCookieName = "PhaseThreeAuthCookie";
    const userAgent = "libbeacon/" + c.version + " (github.com/SESMembers/libbeacon)";
    this._request = Request.defaults({
      rejectUnauthorized: false,
      timeout: 30000,
      headers: {
        "User-Agent": userAgent,
        "Authorization": this.authHeader,
        "Cookie": this.sessionCookieName + '=' + this.cookie;
      },
    });
  }

  get authHeader() {
    return 'Bearer ' +this._token.token.access_token;
  }

  get path() {
    return c.environments[this.environment].api_url + 'Api/v1/'
  }

  get(path, opts, cb) {
    if(!_.isFunction(cb))
        throw new Error('Callback not specified');
      var options = _.defaults(_.clone(opts) || {}, {
        headers: {}, // make sure headers is an empty obj if not passed
      });
      options.url = this.path + path;
      var req = this._request(options, function(error, response, body) {
        if(error) {
          cb && cb(error);
          return;
        }
        if(response.statusCode === 403) {
          cb && cb(new Error("unauthorized"));
          return
        }
        try {
          var data = JSON.parse(body);
        } catch(e) {
          cb && cb(e);
          return;
        }
        cb && cb(null, data);
      });
    }

  setHQ(hq, cb) {
      if(!_.isFunction(cb))
        throw new Error('Callback not specified');
      var self = this;
      var jar = this._request.jar();
      var options = {}
      options.method = 'POST'
      options.url = this.path + 'Account/SetCurrentHq';
      options.form = {"entityId":hq}
      var req = this._request(options, function(error, response, body) {
        if(response.statusCode === 302) { //302 seems to be the only way to know it worked.
          var cookie;
          jar.getCookies(self.baseUrl).forEach(function(c) {
            if(c.key == self.sessionCookieName)
              cookie = c.value;
          });
        self.cookie = cookie //changing HQ sends back a new cookie. save it
        cb && cb(true)
      }
      if(error) {
        cb && cb(false);
        return;
      }
      if(response.statusCode === 403) {
        cb && cb(false);
        return
      }
    });
    }

  getPagedResults(path, opts, cb) {
    if(!_.isFunction(cb))
      throw new Error('Callback not specified');
    this.getPagedResultsPage(path, opts, 1, cb);
  }

  getPagedResultsPage(path, opts, page, cb) {
    // cb(error, finished, data)
    var self = this;
    var options = _.defaults(_.clone(opts) || {}, {
      qs: {}, // make sure qs is an empty obj if not passed
    });
    var totalItemsKey = 'TotalItems';
    if(options.totalItemsKey) {
      totalItemsKey = options.totalItemsKey;
      delete options.totalItemsKey;
    }
    options.qs['PageIndex'] = page;
    const promise = this.get(path, options)
    .then((data) => {
      var bad = false;
      bad = 'CurrentPage' in data ? bad : true;
      bad = 'PageSize' in data ? bad : true;
      bad = totalItemsKey in data ? bad : true;
      bad = 'Results' in data ? bad : true;
      if(bad) {
        cb && cb('Received data that does not contain page information');
        return;
      }
      if(data[totalItemsKey] > data['CurrentPage'] * data['PageSize']) {
        cb && cb(null, false, data['Results']);
        self.getPagedResultsPage(path, opts, page+1, cb);
      }
      else {
        cb && cb(null, true, data['Results']);
      }
    })
    .catch((error) => {
      cb && cb(error);
    });
  }
}

module.exports = Client;
