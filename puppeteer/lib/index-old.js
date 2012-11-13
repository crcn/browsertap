var puppet = require("../../puppet"),
dnode      = require("dnode"),
Url        = require("url"),
dsync      = require("dsync"),
shoe       = require("shoe"),
http       = require("http"),
outcome    = require("outcome"),
guid       = require("guid"),
EventEmitter = require("events").EventEmitter,
pievent      = require("pievent"),
maestro = require("maestro");



exports.createServer = function(puppet, config) {

	var st,
	wrap = dsync(puppet),
	busy = false,
	maestro,
	events = new EventEmitter();

	pievent(events, puppet, {
		"wkm.windows": ["open->openWindow", "close->closeWindow"]
	});

	wrap.events = dsync(events);

	var d = dnode({
		connectMaestro: function(options, callback) {
			maestro = options.maestro;
			callback(null, {
				guid: guid.create().value,
				isBusy: function(callback) {
					callback(null, busy);
				}
			});
		}
	});

	d.listen(config.puppeteer.port);

	var s = http.createServer();

	s.listen(config.puppeteer.port + 1);

	shoe(function(stream) {


		var d = dnode({
			connectClient: function(options, callback) {
				busy = true;
				maestro.authToken(options.token, outcome.error(callback).success(function() {
					callback(null, wrap);
				}));
			}
		});

		d.pipe(stream).pipe(d);

		d.on("end", function() {
			busy = false;
		})
	}).install(s, "/dnode");
}


exports.start = function(config) {
	exports.createServer(puppet.create(config), config);
}


exports.start({
	puppeteer: {
		port: 8000
	},
	rtmp: Url.parse("rtmp://10.0.1.30:1935/live/default"),
	browsers: {
		directory: "~/Desktop/browsers",
		cache: {
			prefix: '~/AppData/Local',
		},
		firefox: {
			processNames: ['firefox*'],
			cache: {
				directory: '/Mozilla'
			},
			padding: {
				12: {
					top: 87
				},
				3.6: { 
					top: 135
				},
				3: {
					top: 106
				}
			}
		},
		chrome: {
			processNames: ["chrome*"],
			cache: {
				directory: '/Google/Chrome/User Data'
			},
			padding: {
				19: {
					top: 61
				},
				5: {
					top: 63
				}
			}
		},
		safari: {
			processNames: ["safari*"],
			cache: {
				directory: '/Apple Computer'
			},
			padding: {
				6: {
					top: 80
				}
			}
		},
		opera: {
			processNames: ["opera*"],
			cache: {
				directory: '/Opera'
			},
			12: {
				top: 80
			}
		}
	}
})