# libbeacon
Library for interacting with beacon. If you don't know what that is this library is _not_ for you!

## Installation
```bash
$ npm install libbeacon
```

## Example
```js
const libbeacon = require('libbeacon')(client_id, client_secret, 'preview');
libbeacon.login('username', 'password').then((api) => {
  api.get('Messages/')
}, (error) => {
  // fail
});
*/
```

## Tests
```bash
$ npm install
$ BEACON_CLIENT_ID='' BEACON_CLIENT_SECRET='' BEACON_USERNAME='user' BEACON_PASSWORD='pass' npm test
```

## License
[MIT](LICENSE)
