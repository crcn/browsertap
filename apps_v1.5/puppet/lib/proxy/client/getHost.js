var Url = require("url");
module.exports = function() {

	var scripts = document.getElementsByTagName("script");


	for(var i = scripts.length; i--;) {
		var script = scripts[i];
		if(~script.src.indexOf("?dnodeClient")) {
			var src = script.src;
			
			//IE doesn't like Url.parse
			var hostname = src.match(/\/\/([^:\/?#]+)/)[1],
			port = src.match(/\:(\d+)/)[1];

			return { host: hostname + ":" + (port || 80) };
		}
	}
}