var step = require('stepc'),
crc32    = require('crc32'),
fs       = require('fs'),
qs       = require('querystring'),
path     = require("path")


//adds the buildId to all dependencies. This ensures new files
//are *always* served to the client

exports.run = function(target, next) {


	var uniqueHash = target.buildId;


	step(

		/**
		 */

		function() {
			fs.readFile(target.entry, "utf8", this)
		},

		/**
		 */

		next.success(function(content) {


			//take CSS into account by looking for ()
			var urls = content.match(/('|"|\()(https?:\/\/)?\/?([^\/\n\r"']+\/)+[^\/\n\r"']+\.\w{2,3}.*?('|"|\))/g) || [];

			urls.forEach(function(url) {


				var cacheHash    = '?' + uniqueHash,
				fixedUrl;

				if(url.indexOf('?') > -1) {

					fixedUrl = url.replace('?', cacheHash + '&');

				} else {

					//take into account stuff like background-image:url(/img/)
					fixedUrl = url.replace(/(\w+\.\w{2,3})(?=(\)|"|'))/,'$1' + cacheHash);

				}


				content = content.replace(url, fixedUrl);

			});

			this(null, content)
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


exports.taskMessage = function(target) {
	return "hashify " + target.entry;
}