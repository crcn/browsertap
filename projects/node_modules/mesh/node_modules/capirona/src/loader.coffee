

module.exports = class Loader

	###
	###

	constructor: (@config) ->
		@_loaders = []

	###
	###

	load: (target, next) ->

		for loader in @_loaders
			return loader.run(target, next, @config) if loader.test target

		throw new Error "Cannot load #{target}"

	###
	###

	add: (loader) -> @_loaders.push loader