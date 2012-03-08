
# stops iframes from accessing the top html page
try	
	return if window.top.__sprite_client 
	window.top.__sprite_client = true

catch e
	return



host = "http://{{host}}"

###
 taps a function
###

tapFunction = (object, property, newFn) ->
	oldFn = object[property]
	object[property] = () ->
		newFn.apply(object, arguments)
		oldFn.apply(object, arguments)


###
###

stringifyqs = (json) ->
	hash = []

	hash.push "#{key}=#{escape(json[key])}" for key of json	

	return if hash.length then "?#{hash.join("&")}" else ""

###
 sends a request to the server
###

request = (path, json, callback) ->
	
	json = {} if not json

	json.cbName = cbName = "#{Date.now()}_#{Math.round(Math.random() * 9999999)}"
	window[cbName] = callback or ->

	script = document.createElement("script")
	script.type = "text/javascript"
	script.src  = "#{host}/#{path}#{stringifyqs(json)}"
	document.body.appendChild(script)


###
 emits an event back to the server
###



###
###

tapFunction document, "onready", () ->
	


