var Puppeteer = require("./puppeteer"),
qs = require("querystring");
exports.require = ["maestro"];
exports.name = "puppeteer";
exports.plugin = function(maestro) {
	var q = qs.parse(window.location.search.substr(1));
	return new Puppeteer(maestro, {
		host: q.host,
		token: q.token
	});
}