require("structr").mixin(require("structr-step"));

var Keyboard = require("./wkm/keyboard"),
Client       = require("./wkm/client"),
Mouse        = require("./wkm/mouse"),
Desktop      = require("./wkm/desktop"),
Browsers     = require("./browsers"),
proxyServer  = require("./proxy/server"),
_            = require("underscore");

exports.create = function(options) {

	var client = new Client(options),
	puppet     = { };

	_.extend(puppet, {
		wkm      : client,
		server   : proxyServer.listen(client, options.port || 8090),
		// mouse    : new Mouse(client),
		// desktop  : new Desktop(puppet, client),
		// keyboard : new Keyboard(client),
		browsers : new Browsers(puppet, options.browsers),

		toPublic: function() {
			return {
				client: puppet.wkm,
				browsers: puppet.browsers
			};
		}
	});

	return puppet;
}