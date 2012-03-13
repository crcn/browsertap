structr = require "structr"

###
 base builder interface
###

exports.Task = class

	###
	###

	constructor: (@route, @factory, @parent = null) -> @init()

	###
	###

	init: ->
	
	###
	 load from raw config
	###

	load: (ops) -> # override me

	###
	 start the build phase
	###

	run: (target, next) ->

		@validate target
			
		# only set the name if it exists - could be a reference, or chain. In
		# which case we want the PARENT chain
		if @route
			target.namespace   = @route.path.value
			target.currentTask = @route.path.value.split('/').pop()

		scopedData = @_copyCurrentScopedData(target)


		@_printMessage scopedData

		@_run scopedData, next


	###
	 creates a child task with this as the parent
	###

	childTask: (route, ops) -> @factory.newTask route, ops, @

	###
	 validates to make sure this task as the right data
	###

	validate: (target) -> 

		params = @_params()

		for name of params
			tester = @_tester params[name]
			tv     = @_ref(target, name)

			throw new Error ("\"--#{name}\" is missing") if (typeof tv == 'undefined')
			
			try
				value = tester.test tv

				if value is false
					throw new Error("is invalid") 

				if not (typeof value is 'boolean')
					@_ref(target, name, value) 
			catch e
				throw new Error("\"--#{name}\" #{e.message}")


	###
	 returns a new validation tester
	###


	_tester: (value) ->

		if value instanceof RegExp
			return value

		if typeof value == 'function'
			return {
				test: (v) -> value(v)
			}

		return {
			test: () -> true
		}

	###
	 returns a reference to an object for validation
	###

	_ref: (target, property, value) ->
		cur = target
		prev = target
		parts = property.split "."
		prevPart = null
		while parts.length and cur
			prevPart = parts[0]
			prev = cur
			cur = cur[parts.shift()]

		prev[prevPart] = value if arguments.length > 2

		return cur


	###
	 the required params for the task
	###

	_params: () -> @params

	###
	 overridable method for running the task
	###

	_run: (target, next) ->

	###
	 prints the CLI task message 
	###

	_printMessage: (target) ->
		message = @_taskMessage target
		console.log "==> #{message}" if message
		

	###
	 the task message to show
	###

	_taskMessage: (target) -> 
		if @route
			"#{target.currentPath}"


	###
	 copies the LIVE parent data - this is similar to setting
	 a variable scope
	###

	_copyCurrentScopedData: (target) ->
		pd = structr.copy @currentData
		cp = @

		while cp.parent

			pc = structr.copy cp.parent.currentData


			pd = structr.copy pd, pc if cp.parent.currentData
			cp = cp.parent

		# cwd is the only data that changes with the given scope.
		target.cwd = pd.cwd or target.cwd

		structr.copy target, pd

	

	###
	###

	_findInheritable: () ->
		cr = @

		while cr
			break if cr.route
			cr = cr.parent

		return cr



###
###

module.exports.test = () -> false

