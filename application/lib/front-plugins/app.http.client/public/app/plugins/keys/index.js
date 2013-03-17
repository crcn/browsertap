var _ = require("underscore");

function buildKeys(e) {
	var keys = [];
	if(e.ctrlKey) keys.push("ctrl");
	if(e.shiftKey) keys.push("shift");
	if(e.altKey) keys.push("alt");
}

exports.name = "keys";

var keyCodes = {
	9:"tab",
	16:"shift",
	17:"ctrl",
	17:"alt",
	91: "ctrl",
	224: "ctrl",
	37: "left",
	39: "right",
	38: "up",
	40: "down"
}


exports.plugin = function() {

	var commands = [], evs = [], keysDown = {};

	function buildKeys(e) {
		var keys = [];
		if(e.ctrlKey) keys.push("CTRL");
		if(e.shiftKey) keys.push("SHIFT");
		if(e.altKey) keys.push("ALT");

		for(var code in keysDown) {
			var shortCode = String(keyCodes[code] || String.fromCharCode(code)).toUpperCase();
			if(!~keys.indexOf(shortCode)) keys.push(shortCode);
		}

		return keys;
	}



	$(window).keydown(function(e) {

		keysDown[e.keyCode] = 1;

		var cmd = buildKeys(e);

		// console.log(e.charCode, e.keyCode, "v".charCodeAt(0), "V".charCodeAt(0));
		// var keys = buildKeys(e);	

		// console.log(cmd)dsdas


		for(var i = commands.length; i--;) {
			var h = commands[i];
			if(_.intersection(h.keys, cmd).length === h.keys.length) {
				return h.fn(e);
			}
		}

		for(i = evs.length; i--;) {
			evs[i](e, cmd);
		}

		console.log("KEY")

		e.preventDefault();

	});

	$(window).keyup(function(e) {
		delete keysDown[e.keyCode];
	})

	$(window).mousemove(function(e) {
		keysDown = {};
	})


	return {
		on: function(key, callback) {
			commands.push({
				keys: key.toUpperCase().split("+"),
				fn: callback
			});
		},
		key: function(fn) {
			evs.push(fn);
		}
	}
}