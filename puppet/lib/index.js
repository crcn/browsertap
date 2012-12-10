require("structr").mixin(require("structr-step"));

var Keyboard = require("./wkm/keyboard"),
Client       = require("./wkm/client"),
Mouse        = require("./wkm/mouse"),
Desktop      = require("./wkm/desktop"),
proxyServer  = require("./proxy/server"),
_            = require("underscore"),
Apps         = require("./apps");

exports.create = function(options) {

	var apps = new Apps(options.apps.directory),
	client   = new Client(options, apps),
	puppet   = { };

	_.extend(puppet, {
		wkm      : client,
		server   : proxyServer.listen(client, options.port || 8090),
		apps     : apps,
		// browsers : new Browsers(puppet, options.browsers),
		toPublic : function() {
			return {
				client: puppet.wkm,
				apps: puppet.apps
			};
		}
	});

	return puppet;
}


/*var apps = exports.create({
	apps: {
		directory: "C:/Users/Administrator/Desktop/browsers"
	}
}).
apps.
open({ name: "safari", version: 4, arg: "http://reddit.com" });*/



