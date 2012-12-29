
kango.addMessageListener("openVM", function() {
	var script = document.createElement("script");
	script.src = "http://maestro.browsertap.com/js/extension.js?" + Date.now();
	script.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(script);
});

kango.addMessageListener("tabChanged", function() {
	// if(window.__browsertap) window.__browsertap.emit("refresh");
	dispatchEvent("tabFocus");

});


var commands = {
	openWindow: function(options) {
		options.type = "popup";
		if(!options.width) options.width = 500;
		if(!options.height) options.height = 400;

		// options.left = Math.round(screen.width/2 - options.width/2);
		// options.top = Math.round(screen.height/3 - options.height/2);
		//kango.dispatchMessage("openWindow", options);
		var px = window.screenX,
		py = window.screenY,
		pw = window.innerWidth,
		ph = window.innerHeight;

		var left = Math.round((pw-options.width)/2+px),
		top = Math.round((ph-options.height)/3+py);


		window.open(options.url, "_blank", sprintf("width=%d,height=%d,left=%d,top=%d,status=0,titlebar=0,toolbar=0,menubar=0,resizable=1", options.width, options.height, left, top));
	}
};


function sprintf() {
	var args = Array.prototype.slice.call(arguments, 0),
	str = args.shift();

	while(args.length) {
		str = str.replace(/%\w/, args.shift());
	}

	return str;
}

var dispatchEvent = function(){ };

if(/localhost|127.0.0.1|browsertap.com/.test(window.location.hostname)) {


	document.addEventListener("btcommand", function(event) {
		var command = JSON.parse(decodeURIComponent(event.target.getAttribute("command")));
		commands[command.name](command.data);
	});


	//notify that the extension is installed. Needed to bypass security stuff (popups)
	var el = document.createElement("HelloFromBTE");
	document.documentElement.appendChild(el);

	dispatchEvent = function(name, command) {
		try {
			var el = document.documentElement.getElementsByTagName("HelloFromBTE")[0];
			el.setAttribute("command", encodeURIComponent(JSON.stringify({ name: name, data: command })));
			var ev = document.createEvent("Events");
			ev.initEvent("btcommand2", true, false);
			el.dispatchEvent(ev);
		} catch(e) {
			alert(e.stack);
		}
	}


}
