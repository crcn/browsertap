seq			= require "seq"
BaseTask    = require("./base").Task
outcome     = require "outcome"
structr     = require "structr"


###
 a chain of builders

 Example:

 "firefox":["combine","compile-firefox"]
###

module.exports = class SkipTask extends BaseTask
	
	load: (config) ->
	_run: (ops, next) -> next()
	_printMessage:() ->
				
	


module.exports.test = () -> true
module.exports.priority = -9999999
