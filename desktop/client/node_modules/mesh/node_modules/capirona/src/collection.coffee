outcome  = require "outcome"
_        = require "underscore"
beanpoll = require "beanpoll"
structr  = require "structr"
dolce    = require "dolce"
path     = require "path"


###
###

class TaskMessenger extends beanpoll.Messenger

	###
	###

	_next: (middleware) ->

		structr.copy @flattenData(), @request.query

		middleware.listener.call @, @request.query, @response.success () => @next()
			

###
###

class TaskDirector extends beanpoll.Director

	###
	###

	passive: false

	###
	###

	_newMessenger: (request, middleware) -> new TaskMessenger request, middleware, @

###
 collection of builders loaded from configurations
###

module.exports = class Tasks

	###
	###

	constructor: (@factory, @makeConfig) ->
		@factory.tasks = @
		@_router = beanpoll.router()
		@_tasks

		@_router.use () =>
			name: 'task',
			director: new TaskDirector 'task', @_router

	###
	###

	load: (rawTasks, inherit) ->


		for routeStr of rawTasks
			for route in @_parseTaskName routeStr, inherit

				taskData = rawTasks[routeStr]

				task = @factory.newTask route, taskData

				if task
					@add task
				else
					@load taskData, route
									
		@
			

	###
	###

	_parseTaskName: (routeStr, inherit) ->

		# make the route compatable with beanpoll 
		fixed  = routeStr
		routes = @_router.parse(fixed)


		for route in routes

			route = @_extendRoute route, inherit

		return routes

	###
	###

	_extendRoute: (target, parent) ->

		return target if not parent

		parentCopy = structr.copy(parent)

		realPathStr = @_router.parse.stringifySegments parentCopy.path.segments.concat target.path.segments

		target.path = @_router.parse.parsePath realPathStr

		thru = target

		while thru.thru
			thru = @_fixThru thru.thru, parent

		thru.thru = parentCopy.thru

		target

	###
	###

	_fixThru: (target, route) ->
		
		tpv = target.path.value
		rpv = route.path.value
		normalized = tpv

		if tpv.substr(0,1) is '.'
			normalized = path.normalize(rpv + "/" + tpv)

		target.path = @_router.parse.parsePath normalized
		target

	###
	###

	_fixPath: (path) ->
		path.
		replace(/:/g,'/').
		replace(/\{\{(\w+)\}\}/g, ':$1')

	###
	###

	add: (task) -> 

		self = @

		task.route.type = "task"
		@_router.on task.route, (target, next) ->
			target.currentPath = self._router.parse.stringifySegments(@current.path.segments, target)
			task.run target, next
	###
	###

	run: (path, target, next) ->

		@_router.
		request(@_fixPath path).
		query(target).
		next (target, next) ->
			this.response.end()
		.
		error(next).
		success(next).
		dispatch('task');


			
