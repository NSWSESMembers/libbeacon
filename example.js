const libbeacon = require("./lib/main.js"); // require('libbeacon');

if(!process.env.IDENTITY_CLIENT_ID || !process.env.IDENTITY_CLIENT_SECRET) {
  assert.fail("Must set IDENTITY_CLIENT_ID and IDENTITY_CLIENT_SECRET");
}

const env = "BEACON_ENV" in process.env ? process.env.BEACON_ENV : 'prod'

const api = libbeacon(
  process.env.IDENTITY_CLIENT_ID,
  process.env.IDENTITY_CLIENT_SECRET,
  env
);

if(!process.env.BEACON_USERNAME || !process.env.BEACON_PASSWORD) {
  assert.fail("Must set BEACON_USERNAME and BEACON_PASSWORD");
}

const client = api.login(
  process.env.BEACON_USERNAME,
  process.env.BEACON_PASSWORD
).then((client) => {
  const promise = client.get('Jobs/1', {}).then((data) => {
    console.log(data);
  });
});

