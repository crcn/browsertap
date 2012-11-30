

var dnode = require("dnode");

var server = dnode({
	hello: function(cb) {
		cb("world");
	}
});

server.listen(process.env.PU_PORT);