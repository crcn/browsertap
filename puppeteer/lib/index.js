var maestro = require("maestro");


maestro.
client().
params({
	browsers: {
		directory: "C:/Users/Administrator/Desktop/browsers",
		cache: {
			prefix: 'C:/Users/Administrator/AppData/Local',
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
}).
require(__dirname + "/maestro-client-plugins").
load();