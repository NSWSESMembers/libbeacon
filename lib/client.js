const c = require('./constants');
const Request = require('request');
const _ = require('underscore');
const debug = require('debug')('libbeacon:client');


class Client {
  constructor(token, environment) {
    debug('Initialize Client with token: ', token);
    this._token = token;
    this.environment = environment;
    const userAgent = "libbeacon/" + c.version + " (github.com/SESMembers/libbeacon)";

    this._request = Request.defaults({
      rejectUnauthorized: false,
      timeout: 30000,
      headers: {
        "User-Agent": userAgent,
        "Authorization": this.authHeader,
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
    debug('Get request for ' + path);
    if(!_.isFunction(cb))
      throw new Error('Callback not specified');
    var options = _.defaults(_.clone(opts) || {}, {
      headers: {}, // make sure headers is an empty obj if not passed
    });
    options.url = this.path + path;

    debug('Making request with args: ', options);
    var req = this._request(options, function(error, response, body) {
      if(error) {
        debug('Error in HTTP request: ' + response);
        cb && cb(error);
        return;
      }
      if(response.statusCode === 403 || response.statusCode === 401) {
        cb && cb(new Error("unauthorized"));
        return
      }
      if(response.statusCode != 200) {
        debug('Non-200 HTTP status code: ' + response.statusCode);
      }
      try {
        var data = JSON.parse(body);
      } catch(e) {
        debug(options.url);
        debug('Could not parse response: ' + body);
        cb && cb(e);
        return;
      }
      cb && cb(null, data);
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
    this.get(path, options, function(error, data) {
      if(error) {
        cb && cb(error);
        return;
      }
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
    });
  }
}

module.exports = Client;