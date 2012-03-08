EventEmitter = require("events").EventEmitter
Application  = require "./Application"


module.exports = class ApplicationManager extends EventEmitter
	
	###
	###

	constructor: () ->
		@_applications = {}

	###
	###

	addApplication: (info) ->
		throw new Error "application #{info.name}" if !!@_applications[info.name]

		@_applications[info.name] = new Application info.name, info.processGroup

	###
	###

	getApplication: (name) -> @_applications[name]

