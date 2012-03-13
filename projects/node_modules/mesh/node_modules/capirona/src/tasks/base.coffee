
###
 base builder interface
###

exports.Task = class

	###
	###

	constructor: (@route, @tasks = null, @parent = null) ->
	
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

		@_printMessage target

		@_run target, next

	###
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
	###

	_params: () -> @params

	###
	###

	_run: (target, next) ->

	###
	###

	_printMessage: (target) ->
		message = @_taskMessage target
		console.log "#{@_pointer()}#{message}" if message
		

	###
	###

	_taskMessage: (target) -> 
		if @route
			"make #{target.currentPath}"


	###
	###

	_pointer: () -> "---> "

module.exports.test = () -> false

