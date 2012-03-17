var beanie = require('beanie');

exports.start = function(ops) {


	beanie.
	loader().
	params({
		publicDir: __dirname + "/public",
		name: "eyebrowse",
		version: 0,
		type: ops.type,
		rootDir: __dirname,
		config: '/usr/etc/spice.io/config.json',
		"http": {
			"port": "8082"
		},
		"mongodb": {
	        "database": "eyebrowse"
		},
		plugins: {
	    "image.resize": true,
	    "auth.session": true,
	    "auth.profile": {
	        "fields": {
	            "username": {
	                "required": true,
	                "type": "String"
	            },
	            "password": {
	                "required": true,
	                "type": "String"
	            },
	            "fullName": {
	                "required": true,
	                "type": "String"
	            }
	        },
	        "usernameField": "username"
	    },
	    "validate.core": true,
	    "env": {
	        "HOSTNAME": "teamdigest.com",
	        "API_HOSTNAME": "teamdigest.spice.io"
	    }
	}
	}).
	paths(__dirname + "/plugins").
	paths(__dirname + "/../node_modules").
	require('spice.io').
	require(__dirname + "/plugins").
	load();

}


 


