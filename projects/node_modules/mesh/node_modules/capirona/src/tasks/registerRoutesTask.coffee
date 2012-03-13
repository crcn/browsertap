BaseTask    = require("./base").Task
tpl         = require "../tpl"
path        = require "path"


###
 references another builder
###

module.exports = class RegisterRoutesTask extends BaseTask
	
	###
	###

	load: (@ops) -> 
		@factory.commands.load @ops, @_findInheritable().route, @


	###
	 passes the build phase 
	###

	_run: (target, next) -> next()

	###
	###

	_printMessage: () ->

	





module.exports.test = (config) ->
	return typeof config == "object"

module.exports.priority = -999;