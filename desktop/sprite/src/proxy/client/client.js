var EventEmitter = require("events").EventEmitter,
URL	             = require("url");


var host = "localhost",
port     = 8089,
em       = new EventEmitter(),
client;


client = DNode({
	title: window.title,
	location: location(),
	history: {
		back: function() {
			history.back();
		},
		forward: function() {
			history.forward();
		}
	},
	navigator: {
		appCodeName: navigator.appCodeName,
		appName: navigator.appName,
		version: navigator.appVersion,
		cookieEnabled: navigator.cookieEnabled,
		platform: navigator.platform,
		userAgent: navigator.userAgent
	},
	setLocation: function(url) {
		window.location = url;
	},
	on: function(type, callback) {
		em.on(type, callback);
	},
	emit: function() {
		em.emit.apply(em, arguments);
	}
});


//bootstrap
if(window.top == window.self) {

	tapFunction(document, "onready", function() {
		em.emit("documentready");
	});

	tapFunction(document, "onmousemove", throttle(function() {
		em.emit("mousemove");
	}, 1000));


	watchLocation();



	client.connect(port, host);
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

		console.log(newLoc)
		if(currentHRef == newLoc) {
			return;
		}
		currentHRef = newLoc;
		em.emit("locationChange", location());
	}, 500)
}

function tapFunction(object, property, newFn) {
	var oldFn = object[property];
	object[property] = function() {
		newFn.apply(object, arguments);
		if(oldFn) {
			oldFn.apply(object, arguments);
		}
	}
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