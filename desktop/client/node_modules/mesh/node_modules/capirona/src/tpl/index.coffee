ejs      = require 'ejs'
structr  = require 'structr'
traverse = require 'traverse'
path     = require 'path'
structr  = require 'structr'


render = (value, data) ->

	clone = traverse(value).clone()

	return traverse(clone).forEach (x) ->

		return if not (typeof x is 'string')

		rendered = x

		# recursively parse template vars - could be refs in refs in refs...
		while rendered.indexOf('<%') > -1
			rendered = ejs.render(rendered, data)

		
		if(data.cwd)
			rendered = path.normalize rendered.replace(/^\./, data.cwd + "/.").replace(/^~/, process.env.HOME + "/");

		this.update(rendered)


exports.render = render;


