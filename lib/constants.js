const package = require('../package.json');

module.exports = {
	version: package.version,
	environments: {
		prod: {
      api_url: 'https://apibeacon.ses.nsw.gov.au/',
			beacon_url: 'https://beacon.ses.nsw.gov.au/',
			identity_url: 'https://identity.ses.nsw.gov.au/',
      oauth_scope: 'beaconApi profile',
		},
		preview: {
      api_url: 'https://apipreviewbeacon.ses.nsw.gov.au/',
			beacon_url: 'https://previewbeacon.ses.nsw.gov.au/',
			identity_url: 'https://identitypreview.ses.nsw.gov.au/',
      oauth_scope: 'beaconApi profile',
		},
	}
}
