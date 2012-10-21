var puppet = require("../../puppet"),
dnode      = require("dnode"),
net        = require("net"),
shoe       = require("shoe"),
Url = require("url"),
wrapPuppet = require("./wrapPuppet");







exports.createServer = function(puppet, config) {

	var st,
	wrap = wrapPuppet(puppet);

			var key = Date.now() + "_" + Math.round(Math.random() * 99999);
	dnode({
		/*initialize: function(maestro, callback) {

			if(key) {
				return callback(new Error("cannot re-initi"))
			}

			callback(null, {
				key: key,
				connect: function(options, callback) {
					if(options.key != key) return callback(new Error("incorrect key"));
					callback(null, wrap);
				}
			});
		},*/
		rtmp: {
			host: "rtmp://" + config.rtmp.host + "/live"
		},
		connect: function(options, callback) {
			callback(null, wrap);
		}
	}).listen(config.puppeteer.port);
}


exports.start = function(config) {
	exports.createServer(puppet.create(config), config);
}


exports.start({
	puppeteer: {
		port: 8000
	},
	rtmp: Url.parse("rtmp://192.168.2.3:1935/live/default"),
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