EventEmitter = require("events").EventEmitter
URL          = require("url")

# stops iframes from accessing the top html page
return if window.top != window.self




host = 'localhost'
port = 8089


###
###

tapFunction = (object, property, newFn) ->
	oldFn = object[property]
	object[property] = () ->
		newFn.apply(object, arguments)
		oldFn.apply(object, arguments) if oldFn

###
###

debounce = (fn, delay) ->
		
	timeout = null
	onTimeout = () -> fn.apply this, arguments

	() ->
		clearTimeout timeout
		timeout = setTimeout onTimeout, delay

###
###

throttle = (fn, delay) ->
		
	running = false
	onTimeout = () -> 
		running = false
		fn.apply this, arguments

	() ->
		return false if running
		running = true
		setTimeout onTimeout, delay

###
###

location = () -> 
	URL.parse window.location.href, true


###
###

em = new EventEmitter()

client = DNode {

	title: document.title
	location: location()
	history: {
		back: () -> history.back()
		forward: () -> history.forward()
		go: (index) -> history.go(index)
	}

	setLocation: (url) ->
		window.location = url;

	on: (type, callback) ->
		em.addListener type, callback

	emit: () ->
		em.emit.apply em, arguments
}



###
 listens for an event to fire on a dom object
###

listen = (target, events) ->
	
	for event in events
		do (event) ->
			tapFunction target, event, (arg1) -> em.emit(event, arg1)


###
 watches for the top url to change
###


watchLocation = () ->
	
	currentHRef = window.location.href

	setInterval( () ->

		newLoc = location().href
		
		return if currentHRef is newLoc
		console.log "location change"
		currentHRef = newLoc 
		em.emit "locationChange", location()

	, 500);




# bootstrap
tapFunction document, "onready", () -> bridge.emit "documentready"
tapFunction document, "onmousemove", throttle () -> 
		em.emit "mousemove"
	, 1000

watchLocation()
client.connect port, host


	
	


