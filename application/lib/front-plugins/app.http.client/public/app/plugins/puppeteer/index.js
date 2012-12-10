var Puppeteer = require("./puppeteer"),
qs = require("querystring");
exports.name = "puppeteer";
exports.require = ["commands", "bark"]
exports.plugin = function(commands, bark, loader) {
	return new Puppeteer(loader.params("puppeteer"), bark, commands);
}