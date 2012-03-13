seq			= require "seq"
BaseTask    = require("./base").Task
outcome     = require "outcome"
tpl         = require "../tpl"


###
 a chain of builders

 Example:

 "firefox":["combine","compile-firefox"]
###

module.exports = class TimeoutTask extends BaseTask
	
	###
	###

	load: (ops) -> 
		@timeout = ops.sleep
				
	###
	###

	_run: (target, next) -> 
		setTimeout(next, @timeout)



module.exports.test = (config) ->
	return config.sleep
