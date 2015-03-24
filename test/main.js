var assert = require("assert")
var Libbeacon = require("../lib/main")

var credentials = {
  username: process.env.BEACON_USERNAME,
  password: process.env.BEACON_PASSWORD
}

var setupAndLogin = function(cb) {
  if(!credentials.username || !credentials.password) {
    console.log("Must set BEACON_USERNAME and BEACON_PASSWORD");
  }
  var beacon = new Libbeacon();
  beacon.login(
    credentials.username,
    credentials.password,
    function(error, success) {
      assert.ifError(error);
      assert.equal(success, true);
      cb(beacon);
    }
  );
}

describe('Libbeacon', function() {
  describe('login()', function() {
    this.timeout(5000); // login is slow :(
    it('should succeed but return false with invalid credentials', function(done) {
      var beacon = new Libbeacon();
      beacon.login('test','test', function(error, success) {
        assert.ifError(error);
        assert.equal(success, false);
        done();
      });
    });

    it('should fail and throw an error', function(done) {
      var beacon = new Libbeacon();
      beacon.baseUrl = 'http://google.com';
      beacon.login('test','test', function(error, success) {
        assert(error);
        done();
      });
    });

    it('should login successfully', function(done) {
      if(!credentials.username || !credentials.password) {
        console.log("Must set BEACON_USERNAME and BEACON_PASSWORD");
      }
      var beacon = new Libbeacon();
      beacon.login(
        credentials.username,
        credentials.password,
        function(error, success) {
          assert.ifError(error);
          assert.equal(success, true);
          done();
        }
      );
    });
  });

  describe('get()', function() {
    var beacon;
    before(function(done) {
      setupAndLogin(function(result) {
        beacon = result;
        done();
      });
    });

    it('should fetch a job', function(done) {
      beacon.get('Jobs/1', {}, function(error, data) {
        assert.ifError(error);
        assert('Id' in data);
        assert('Identifier' in data);
        done();
      });
    });

    it('should fetch a job and override a header', function(done) {
      beacon.get('Jobs/1', {headers: {"X-Test": 1}}, function(error, data) {
        assert.ifError(error);
        assert('Id' in data);
        assert('Identifier' in data);
        done();
      });
    });
  });

  describe('getPagedResults()', function() {
    this.timeout(10000);

    var beacon;
    before(function(done) {
      setupAndLogin(function(result) {
        beacon = result;
        done();
      });
    });

    it('should fetch some locations', function(done) {
      var locations = [];
      
      beacon.getPagedResults('Entities', {qs: {"Q": ""}}, function(error, finished, data) {
        assert.ifError(error);
        locations = locations.concat(data);
        if(finished) {
          // make sure we get more than one page (50)
          assert(Array.isArray(locations));
          assert(locations.length > 60);
          done();
        }
      });
    });

    it('should fail requesting non-page API', function(done) {
      beacon.getPagedResults('Jobs/1', {}, function(error, finished, data) {
        assert(error);
        assert(!finished);
        done();
      });
    });
  });
});
