

kango.addMessageListener("openVM", function() {
	var script = document.createElement("script");
	script.src = "http://localhost:8082/extension.js"
	script.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(script);
});

kango.addMessageListener("refresh", function() {
	// if(window.__browsertap) window.__browsertap.emit("refresh");
});