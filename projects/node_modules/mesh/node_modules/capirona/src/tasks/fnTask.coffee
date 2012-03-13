seq			= require "seq"
BaseTask    = require("./base").Task
outcome     = require "outcome"
tpl         = require "../tpl"


###
 a chain of builders

 Example:

 "firefox":["combine","compile-firefox"]
###

module.exports = class LogTask extends BaseTask
	
	###
	###

	load: (@fn) -> 
				
	###
	###

	_run: (target, next) -> @fn.call this, target, next

	


module.exports.test = (config) ->
	return config instanceof Function
