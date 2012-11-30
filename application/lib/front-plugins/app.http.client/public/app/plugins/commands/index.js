var EventEmitter = require("events").EventEmitter;
exports.name = "commands";
exports.plugin = function(loader) {
	return loader.commands = new EventEmitter();
}