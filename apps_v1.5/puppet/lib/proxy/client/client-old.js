var EventEmitter = require("events").EventEmitter,
URL	             = require("url"),
dnode            = require("dnode");



//bootstrap
if(window.top == window.self) {

	tapFunction(document, "onready", function() {
		em.emit("documentready");
	});

	tapFunction(document, "onmousemove", throttle(function() {
		em.emit("mousemove");
	}, 1000));


	watchLocation();
}

//private


function listen(target, event) {

	if(event instanceof Array) {
		for(var i = event.length; i--;) {
			listen(target, event[i]);
		}	
		return;
	}

	tapFunction(target, event, function(arg1) {
		em.emit(event, arg1);
	})
}


function watchLocation() {
	var currentHRef = location().href;

	setInterval(function() {
		var newLoc = location().href;

		if(currentHRef == newLoc) {
			return;
		}
		currentHRef = newLoc;
		em.emit("locationChange", location());
	}, 500)
}



function debounce(fn, delay) {
	var timeout = null,
	onTimeout = function() {
		fn.apply(this, arguments);
	}

	return function() {
		clearTimeout(timeout);
		timeout = setTimeout(onTimeout, delay);
	}
}

function throttle(fn, delay) {
	var running = false,
	onTimeout = function() {
		running = false;
		fn.apply(this, arguments);
	}

	return function() {
		if(running) return false;
		running = true;
		setTimeout(onTimeout, delay);
	}
}

function location() {
	return URL.parse(window.location.href, true);
}