BaseTask    = require("./base").Task

###
 builds from a .js file
###

module.exports = class ScreiptTask extends BaseTask
	
	###
	###

	load: (ops) ->

		# load the target script
		@task = require ops.script

	###
	 passes the build phase 
	###

	_run: (target, next) -> 
		@task.run.call this, target, next

	###
	###

	_taskMessage: (target) ->
		return if @task.taskMessage then @task.taskMessage target else super target

	###
	###

	_params: () -> 
		@task.params



module.exports.test = (config) ->
	return !!config.script