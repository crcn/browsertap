var step = require("step");

exports.require = ["commands"];




exports.plugin = function(commands) {

	var bridge = prepare();
	
	commands.on("popup", function(options) {
		step(
			function() {
				if(bridge.exists) return bridge.execute("openWindow", options);	
				this();//PROMPT
			}
		);
	});
}



function prepare() {

	var el = document.createElement("BrowserTapComLine");
	document.documentElement.appendChild(el);
	return {
		exists: document.getElementsByTagName("hellofrombte").length,
		execute: function(command) {
			el.setAttribute("command", encodeURIComponent(JSON.stringify(command)));
			var ev = document.createEvent("Events");
			ev.initEvent("btcommand", true, false);
			el.dispatchEvent(ev);
		}
	};
}