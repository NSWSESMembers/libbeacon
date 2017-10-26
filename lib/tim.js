var libbeacon = require("../lib/main.js")(process.env.IDENTITY_CLIENT_ID, process.env.IDENTITY_CLIENT_SECRET, 'preview');


libbeacon.login(process.env.BEACON_USERNAME, process.env.BEACON_PASSWORD).then((api) => {
  console.log(typeof api )
  console.log(api)
  api.get('Messages/').then(err,data) => {
    console.log(data)
  }
}, (error) => {
  // fail
});
