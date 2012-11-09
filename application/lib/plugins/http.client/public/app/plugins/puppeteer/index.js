var Puppeteer = require("./puppeteer");

exports.require = ["maestro"];
exports.name = "puppeteer";
exports.plugin = function(maestro) {
	return new Puppeteer(maestro);
}