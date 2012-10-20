var Url = require("url");
module.exports = function() {
	var script = Array.prototype.slice.call(document.getElementsByTagName("script")).filter(function(script) {
		return ~script.src.indexOf("?dnodeClient");
	}).pop().src;
	return Url.parse(script);
}