var plugin = require("plugin"),
config = require("C:\\programData\\browsertap\\config.json"),
_ = require("underscore");


plugin().
params(_.extend({
	apps: {
		directory: "C:/Users/Administrator/Desktop/browsers"
	},
  http: {
    pot: 8080
  }
}, config)).
require(__dirname + "/plugins").
load(function(e) {
	if(e) console.error(e.stack);
});

