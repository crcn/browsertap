var step = require('stepc'),
fs       = require('fs'),
minify   = require('html-minifier').minify,
_        = require('underscore');


//adds the buildId to all dependencies. This ensures new files
//are *always* served to the client

exports.run = function(target, next) {


	function _minify(content) {


		function canRemoveWhitespace(tag, attrs) {

			if(tag != 'script') return false;


			for(var i = attrs.length; i--;) {

				var attr = attrs[i];

				if(attr.name == 'type' && attr.value.match(/text\/x-tmpl-\w+/)) {
					
					return true;

				} 

			}

			return false;
		}

		return minify(content,  _.defaults(target, {
			removeEmptyElements: false,
			removeAttributeQuotes: false,
			collapseBooleanAttributes: false,
			removeCDATASectionsFromCDATA: false,
			removeCommentsFromCDATA: false,
			removeEmptyAttributes: true,
			collapseWhitespace: true,
			removeComments: true,
			canTrimWhitespace: canRemoveWhitespace,
			canCollapseWhitespace: canRemoveWhitespace
		}));

	}



	step(

		/**
		 */

		function() {
			fs.readFile(target.entry, "utf8", this)
		},

		/**
		 */

		next.success(function(content) {


			minified = _minify(content);

			this(null, minified)
		}),


		/**
		 */

		 next.success(function(content) {

		 	fs.writeFile(target.output, content, this);

		 }),

		 /**
		  */

		 next

	);
}