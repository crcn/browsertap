fs            = require "fs"
path          = require "path"
step          = require "stepc"
outcome       = require "outcome"
Commands      = require "./commands"



###
 creates new builders based on configs given
###

module.exports = class Factory
	
	###
	###

	constructor: () ->
		@_classes = []
		@commands = new Commands @
		
	###
	 adds a builder class - must also be a tester
	###

	add: (clazz) ->

		clazz.priority = 0 if not clazz.priority

		@_classes.push clazz

		@_classes = @_classes.sort (a, b) ->
			if a.priority > b.priority
				return -1
			else
				return 1

	###
	 returns a new builder based on the options given. CWD is also
	 important since SOME builders may load from disc
	###

	newTask: (route, ops, parent) ->


		for clazz in @_classes

			if clazz.test ops
				
				# new builder 
				task = new clazz route, @, parent

				# load it with the options given
				task.load ops

				# return the builder
				return task

		# no builder? return null
		null