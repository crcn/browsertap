var Puppeteer = require("./puppeteer"),
qs = require("querystring");
exports.name = "puppeteer";
exports.plugin = function(loader) {
	return new Puppeteer(loader.params("puppeteer"));
}