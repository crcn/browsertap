var Url = require("url");
module.exports = function() {

	var scripts = document.getElementsByTagName("script");


	for(var i = scripts.length; i--;) {
		var script = scripts[i];
		if(~script.src.indexOf("?dnodeClient")) {
			return Url.parse(script.src);
		}
	}
}