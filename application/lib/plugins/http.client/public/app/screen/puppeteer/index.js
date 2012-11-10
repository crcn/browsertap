var Puppeteer = require("./puppeteer");

exports.require = ["maestro"];
exports.name = "puppeteer";
exports.plugin = function(maestro) {
	console.log("G")
	return new Puppeteer(maestro);
}