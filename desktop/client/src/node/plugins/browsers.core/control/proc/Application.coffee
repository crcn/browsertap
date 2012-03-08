EventEmitter = require("events").EventEmitter

module.exports = class Application extends EventEmitter

	###
	 @param name the name of the application ~ IE 6, IE 7, IE 8
	 @processGroup the process group 
	###

	constructor: (@name, @processGroup) ->


	###
	###
