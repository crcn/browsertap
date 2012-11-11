
kango.addMessageListener("openVM", function() {
	var script = document.createElement("script");
	script.src = "http://localhost:8082/extension.js"
	script.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(script);
});

kango.addMessageListener("refresh", function() {
	// if(window.__browsertap) window.__browsertap.emit("refresh");
});


window.__test = "hello";
var commands = {
	openWindow: function(options) {
		console.log("DISP")
		options.type = "popup";
		if(!options.width) options.width = 500;
		if(!options.height) options.height = 400;
		kango.dispatchMessage("openWindow", options);
	}
}

if(/localhost|127.0.0.1|browsertap.com/.test(window.location.hostname)) {


	document.addEventListener("btcommand", function(event) {
		var command = JSON.parse(decodeURIComponent(event.target.getAttribute("command")));
		commands[command.name](command.data);
	});


	//notify that the extension is installed. Needed to bypass security stuff (popups)
	var el = document.createElement("HelloFromBTE");
	document.documentElement.appendChild(el);

}
