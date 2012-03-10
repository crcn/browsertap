BaseTask    = require("./base").Task
structr     = require "structr"
tpl         = require "../tpl"

###
 the ENTRY point into the build system
###

module.exports = class TargetTask extends BaseTask
	
	###
	###

	load: (@target) ->
		@task = @tasks.factory.newTask null, @target.task

	###
	 passes the build phase 
	###

	_run: (target, next) -> 
		
		obj = {}

		#structr.copy @target, target
		structr.copy target, obj
		structr.copy @target, obj


		# parse the object incase vars are passed 
		obj = tpl.render obj, target


		@task.run obj, next
	
	###
	###

	_taskMessage: (target) -> "target #{target.currentPath}"

	###
	###

	_pointer: () -> "* "
		




module.exports.test = (config) ->
	return !!config.task