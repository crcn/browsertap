var step = require("step"),
sprintf = require("sprintf").sprintf;

exports.require = ["bark", "commands"];
exports.name = "extbrdg";
exports.plugin = function(bark, commands) {
	var bridge = prepare();


	commands.on("popup", function(options) {
		step(
			function() {
				console.log("opening url %s", options.url);
				if(bridge.exists()) return bridge.execute("openWindow", options);	

				//never close
				bark.clickToClose("Click anywhere to generate new window", function() {

				var px = window.screenX,
				py = window.screenY,
				pw = window.innerWidth,
				ph = window.innerHeight;

				var left = Math.round((pw-options.width)/2+px),
				top = Math.round((ph-options.height)/3+py);

					window.open(options.url, "_blank", sprintf("width=%d,height=%d,left=%d,top=%d,status=0,titlebar=0,toolbar=0,menubar=0,resizable=1", options.width, options.height, left, top));
				});
			}
		);
	});

	var commands2 = {
		tabFocus: function() {
			commands.emit("focus");
		}
	}

	document.addEventListener("btcommand2", function(event) {
		var command = JSON.parse(decodeURIComponent(event.target.getAttribute("command")));
		commands2[command.name](command.data);
	});
}



function prepare() {

	var el = document.createElement("BrowserTapComLine");
	document.documentElement.appendChild(el);
	return {
		exists: function() {
			return !!document.getElementsByTagName("hellofrombte").length;
		},
		execute: function(name, command) {

			el.setAttribute("command", encodeURIComponent(JSON.stringify({ name: name, data: command })));
			var ev = document.createEvent("Events");
			ev.initEvent("btcommand", true, false);
			el.dispatchEvent(ev);
		}
	};


}