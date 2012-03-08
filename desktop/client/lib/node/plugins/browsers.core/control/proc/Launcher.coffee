EventEmitter  = require("events").EventEmitter
child_process = require("child_process")
exec          = child_process.exec
spawn         = child_process.spawn

module.exports = class Launcher extends EventEmitter
	
	###
	###

	constructor: (@app) ->
		super()

	###
	###

	load: (path) ->

		@emit "loading"

		if process.platform == "win32"
			@_loadWin32 path


	###
	###

	kill: () ->


	###
	 starts a windows process
	###


	_loadWin32: (toOpen) ->

		proc = spawn "start", ["/MAX", "/HIGH", @app.path, toOpen]

		proc.stdout.on "data", (data) => @emit "stdout", data
		proc.stderr.on "data", (data) => @emit "stderr", data





	###
	###

	_loadUnix: () -> throw new Error("not supported yet");
