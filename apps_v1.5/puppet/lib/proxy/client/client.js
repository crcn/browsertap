var dnode    = require("dnode"),
EventEmitter = require("events").EventEmitter,
URL	         = require("url"),
shoe         = require("shoe"),
getHost      = require("./getHost");

exports.listen = function() {

	var scriptUrl = getHost();

	var em = new EventEmitter(),
	locEm  = new EventEmitter()
	client = {
		emitter: em,
		title: window.title,
		location: {
			get: function(callback) {
				callback(null, location());
			},
			set: function(value, callback) {
				if(location().href != location(value).href) {
					window.location = value;
				}
				if(callback) callback(null, location());
			},
			back: function() {
				history.back();
			},
			forward: function() {
				history.forward();
			},
			on: function(type, callback) {
				locEm.on(type, callback);
			},
			emit: function() {
				locEm.apply(em, arguments);
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
		on: function(type, callback) {
			em.on(type, callback);
		},
		emit: function() {
			em.emit.apply(em, arguments);
		}
	}

	var d = dnode(client);
	watchLocation(client);

	d.pipe(shoe("http://" + scriptUrl.host + "/dnode")).pipe(d);


	return client;
}


exports.start = function() {
	exports.listen();
}


function watchLocation(client) {
	var currentHRef = location().href;

	setInterval(function() {
		var newLoc = location().href;

		if(currentHRef == newLoc) {
			return;
		}
		currentHRef = newLoc;
		em.emit("locationChange", location());
		client.location.emit()
	}, 500)
}


function location(loc) {
	return URL.parse(loc || window.location.href, true);
}