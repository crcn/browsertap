var Puppeteer = require("./puppeteer"),
qs = require("querystring");
exports.name = "puppeteer";
exports.require = ["commands"]
exports.plugin = function(commands, loader) {
	return new Puppeteer(loader.params("puppeteer"), commands);
}