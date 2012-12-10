var dnode    = require("dnode"),
EventEmitter = require("events").EventEmitter,
URL	         = require("url"),
shoe         = require("shoe"),
getHost      = require("./getHost");


var em = new EventEmitter(),
locEm  = new EventEmitter();

exports.listen = function() {

	var scriptUrl = getHost();

	var _id = Date.now() + "_" + Math.round(Math.random() * 999999999999);
	client = {
		id: _id,
		emitter: em,
		title: document.title,
		location: {
			get: function(callback) {
				callback(location());
			},
			set: function(value, callback) {
				if(location().href != location(value).href) {
					window.location = value;
				}
				if(callback) callback(location());
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
		},
		scrollbar: {
			to: function(x, y) {
				window.scrollTo(x, y);
			},
			getPosition: function(callback) {
				callback(document.body.scrollWidth, document.body.scrollHeight);
				// callback(window.innerWidth, window.innerHeight);
			}
		},
		foundWindow: function() {
			clearInterval(setTitle);
			document.title = orgTitle;
		}
	};

	var orgTitle = document.title,
		setTitle = setInterval(function() {
		document.title = _id;
	}, 500);

		/*setInterval(function() {
			console.log(document.body.clientWidth+" "+document.body.clientHeight)
		}, 500)*/


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
		console.log("location change")
		currentHRef = newLoc;
		em.emit("locationChange", location());
		client.location.emit()
	}, 500)
}


function location(loc) {
	return URL.parse(loc || window.location.href, true);
}
