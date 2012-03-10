fs             = require "fs"
path           = require "path"
step           = require "stepc"
outcome        = require "outcome"
seq            = require "seq"
Tasks          = require "./collection"
traverse       = require "traverse"
Loader         = require "./loader"
TaskFactory    = require "./factory"
_              = require "underscore"
crc32          = require "crc32"
plugin         = require "plugin"
structr		   = require "structr"
tpl            = require "./tpl"



### 
 the mesh config value object
###

class Config


	###
	###

	constructor: () ->

		# the tasks to run
		@_taskFactory = new TaskFactory()
		@_loadPlugins @_taskFactory, __dirname + "/tasks"
			
		# configuration delegate 
		@_configLoader = new Loader @
		@_loadPlugins @_configLoader, __dirname + "/loaders"

		# flow-control
		@_seq = seq()

		# clears vars & configs
		@clear()

		@_loaded = {}


	###
	 Loads  configuration
	###

	load: (source, ops, next) ->

		if typeof ops is 'function'
			next = ops


		ops = {} if not ops

		if @_loaded[source]
			console.warn "#{source} is already loaded"
			next null, { config: {} }
			return @

		@_loaded[source] = {}

		self = @
		seqNext = null
		loaded = false

		@_seq.seq () ->
			seqNext = this

			# happens if loading *while* running
			seqNext() if loaded



		seq().seq () ->
			self._configLoader.load source, @

		.seq (config) ->
			config.cwd = ops.cwd if ops.cwd
			cfg = self._onLoad config
			@ null, cfg

		.seq (cfg) ->

			# callback provided? call it now.
			if next
				next null, { config: cfg }

			@()

		.seq () ->
			loaded = true
			seqNext() if seqNext



		@

	###
	###

	next: (fn) ->
		@_seq.seq fn
		@


	###
	 resets the tasks & vars
	###

	clear: () ->

		@config   = { buildId: crc32 String Date.now() }
		@_tasks   = new Tasks @_taskFactory, @

		@



	###
	 loads a config from disc - important because they MAY contain
	 scripts - in which case we'll need the CWD
	###

	run: (paths, target, complete) ->

		if typeof target == "function"
			complete = target
			vars     = {}

		paths = [paths] if not (paths instanceof Array)

		self = @




		@_seq.seq () ->

			if target.cwd
				self.cwd = target.cwd

			next = @

			seq(paths).
			seqEach (path) ->

				config = structr.copy(self.config)
				config = structr.copy(target, config) 
				config.task = path

				self._run path, config, (err) =>
					return complete err if err
					@()
			.seq () ->
				next()

		.
		seq () ->
			complete()


	### 
	###

	_run: (path, target, next) -> @_tasks.run path, target, next



	###
	 handles loaded config objects. 
	 TODO: clean this shit - it hurts my eyes >.>
	###

	_onLoad: (config) ->

		self = @
		self.cwd = config.cwd if config.cwd

		tasks = config.tasks

		# don't this parsed
		delete config.tasks




		# oh god what a mess >.>
		# TODO: clean me.

		# first need to copy the old config
		oldConfig = structr.copy @config

		# copy the NEW config to the old config - prepare for parsing incase
		# the new config has some vars we need to render
		oldConfig = structr.copy config, oldConfig

		# render the NEW config from the OLD config + new config - at this point
		# we ONLY want what's new so we can return it
		renderedConfig = tpl.render(config, oldConfig)



		## additional stuff to load
		load = renderedConfig.load or []
		load = [load] if load and (typeof load == 'string')


		@load cfgPath for cfgPath in load


		delete renderedConfig.load


		# finally - copy the CHANGED vars over to the OLD config
		@config = structr.copy(renderedConfig, @config)

		# load the tasks
		@_tasks.load tasks

		# return only the changed stuff
		renderedConfig


	

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



exports.make = -> new Config()







			
		