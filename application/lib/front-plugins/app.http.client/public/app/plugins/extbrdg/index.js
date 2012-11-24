var step = require("step");

exports.require = ["commands"];
exports.name = "extbrdg";
exports.plugin = function(commands) {
	var bridge = prepare();
	commands.on("popup", function(options) {
		step(
			function() {
				console.log("opening url %s", options.url);
				if(bridge.exists) return bridge.execute("openWindow", options);	
				// this();//PROMPT
			}
		);
	});

	/*commands.on("closed", function(options) {
		if(confirm("This window has been disconnected. Close?")) {
			window.close();
		}
	})*/
}



function prepare() {

	var el = document.createElement("BrowserTapComLine");
	document.documentElement.appendChild(el);
	return {
		exists: document.getElementsByTagName("hellofrombte").length,
		execute: function(name, command) {

			el.setAttribute("command", encodeURIComponent(JSON.stringify({ name: name, data: command })));
			var ev = document.createEvent("Events");
			ev.initEvent("btcommand", true, false);
			el.dispatchEvent(ev);
		}
	};
}