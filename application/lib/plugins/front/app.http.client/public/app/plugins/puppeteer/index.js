var Puppeteer = require("./puppeteer"),
qs = require("querystring");
exports.name = "puppeteer";
exports.require = ["commands", "states"]
exports.plugin = function(commands, states, loader) {
	return new Puppeteer(loader.params("puppeteer"), states, commands);
}