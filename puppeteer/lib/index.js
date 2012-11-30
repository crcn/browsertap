var plugin = require("plugin");


plugin().
params({
	apps: {
		directory: "C:/Users/Administrator/Desktop/browsers"
	}
}).
require(__dirname + "/plugins").
load(function(e) {
	if(e) console.error(e.stack);
});

