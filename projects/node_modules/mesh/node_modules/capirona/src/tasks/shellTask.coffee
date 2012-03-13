BaseTask    = require("./base").Task
tpl         = require "../tpl"
exec        = require("child_process").exec

###
 executes a shell script
###

module.exports = class ShellTask extends BaseTask
	
	###
	###

	load: (ops) ->
		@exec = ops.exec

	###
	 passes the build phase 
	###

	_run: (target, next) -> 

		cmd = @_cmd target

		child = exec cmd, { cwd: target.cwd, maxBuffer: 0 }, next

		# taking a look at the sauce code - there's a buffer that's appended.
		# We don't want that shit, so remove the listeners. This also fixes 
		# the thrown exception for long processes
		child.stdout.removeAllListeners('data')
		child.stderr.removeAllListeners('data')

		child.stdout.on 'data', (data) ->
			String(data).split('\n').forEach (msg) ->
				console.info msg

		child.stderr.on 'data', (data) ->
			String(data).split('\n').forEach (msg) ->
				console.error msg



	###
	###

	_taskMessage: (target) -> @_cmd target

	###
	###

	_cmd: (target) -> 	
		return tpl.render @exec, target



module.exports.test = (config) ->
	return !!config.exec