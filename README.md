# libbeacon
Library for interacting with beacon. If you don't know what that is this library is _not_ for you!

## Installation
```bash
$ npm install libbeacon
```

## Example
```js
var beacon = new Libbeacon();
beacon.login('username', 'password', function(err, success) {
    beacon.get('Jobs/1', {}, function(error, data) {
        console.log(data);
    }
});
```

## Tests
```bash
$ npm install
$ BEACON_USERNAME='user' BEACON_PASSWORD='pass' npm test
```

## License
[MIT](LICENSE)
