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

	load: (obj) -> 
		@log = obj.log
		
		
				
	###
	###

	_run: (target, next) ->
		next()

	###
	###

	_taskMessage: (target) -> "#{tpl.render @log, target}"
	


module.exports.test = (config) ->
	return !!config.log
