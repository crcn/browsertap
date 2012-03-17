var beanie = require('beanie');


beanie.
loader().
params({
	http: {
		port: 8083
	},
	daisy: {
		name: 'desktop_client',
		host: "10.0.1.14",
		transport: {
			rabbitmq: {
				host: "10.0.1.14"
			}
		}
	},
	aws: {
		key: "AKIAJKBGOTIITATBXTIQ",
		secret: "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"
	},
	s3: {
		bucket: "ebsshot" 
	}
}).
paths(__dirname + "/../node_modules").
require('beanpoll-http').
require('daisy').
require(__dirname + '/plugins').
load();