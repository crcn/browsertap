var vows = require('vows'),
assert = require('assert'),
ya = require('../')


vows.describe('Config Handler').addBatch({

	'A config': {

		topic: function() {


			var cfg = ya.config({
				name: 'craig',
				address: {
					zip: '55378',
					city: 'Savage',
					state: 'Minnesota'
				}
			});

			return cfg;
		},

		'Has a zip of 55378': function(topic) {
			assert.equal(topic.get('address:zip'), '55378');
			assert.equal(topic.child('address').get('zip'), '55378');
		},

		/**
		 */

		'Has a child changed zip of 55124': function(topic) {
			assert.equal(topic.child('address').set('zip','55124'), '55124');
			assert.equal(topic.get('address:zip'), '55124');
		},

		/**
		 */

		'can handler persistence': function(topic) {

			topic.child('address').persist('src', {
				read: function(source, callback) {
					callback({ zip: 90210 });
				},
				write: function(source, value) {
				}
			});


			assert.equal(topic.get('address:zip'), '90210');
			topic.set('address:zip', '55124');
		},


	}
}).export(module);