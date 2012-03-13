
TaskFactory    = require "./factory"
crc32          = require "crc32"
plugin         = require "plugin"
require "colors"
path           = require "path"


fileRegexp = /(\s+\/([^\/\s]+\/)+[^\/\s]+)/;
fileRegexp2 = /(\s+\/([^\/\s]+\/)+[^\/\s]+)/g;


require("colorcode").
code(/\==> (\w+)/, "==>".cyan+" $1".magenta).
code(/\==> load (.*)/, "==> ".cyan+"load".magenta.bold+" $1".bold).
code(/( -> )/, "$1".yellow).
code(/( \+ )/g, "$1".yellow).
code(fileRegexp, (value) ->
	value.match(fileRegexp2).forEach (file) ->
		value = value.replace file, " " + path.relative(process.cwd(), file.replace(/\s+/g,""))

	value

).
error( (msg) ->
	return String(msg).stripColors.bold.red
)
.info( (msg) ->
	return String(msg).stripColors.grey
)
.export(console)



### 
 the mesh config value object
###

class RootTask


	###
	###

	constructor: (rawTasks) ->

		# makes new tasks based on config data
		@taskFactory = new TaskFactory @
		@_loadPlugins @taskFactory, __dirname + "/tasks"

		# the entry task 
		@entryTask = @taskFactory.newTask null, rawTasks


	###
	 loads a config from disc - important because they MAY contain
	 scripts - in which case we'll need the CWD
	###

	run: (target, complete) ->

		if typeof target == 'function'
			complete = target
			target = {}

		target.buildId = crc32 String Date.now()

		@entryTask.run target, complete


	###
	 loads plugins for task factory, or config loader
	###

	_loadPlugins: (factory, directories) ->

		plugin.
		loader().
		factory (plugin) ->
			factory.add plugin
		.
		require(directories).
		load()



exports.make = () -> new RootTask Array.apply [], arguments







			
		