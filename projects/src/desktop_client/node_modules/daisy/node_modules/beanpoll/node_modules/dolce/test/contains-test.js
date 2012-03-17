var vows = require('vows'),
dolce = require('../'),
assert = require('assert');


vows.describe('Explicit Routes').addBatch({
	
	'An explicit collection of routes': {
		
		topic: function() {
			var collection = require('./test-helper').collection({
				'/': 1,
				'a': 1,
				'a/:b': 1,
				'a/b': 1
			});

			return collection;
		},

		'contains root': function(topic) {
			assert.isTrue(topic.contains(''));
		},
		'contains a': function(topic) {
			assert.isTrue(topic.contains('a'));
		},

		'contains a/b': function(topic) {
			assert.isTrue(topic.contains('a/b'));
		},

		'contains a/:b': function(topic) {
			assert.isTrue(topic.contains('a/:b'));
		},

		'does not contain -method=GET a/b': function(topic) {
			assert.isTrue(!topic.contains('a/b', { tags: { method: 'GET'}}));
		}
	}
}).export(module);