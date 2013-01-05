require("es5-shim");
var domReady = require("domready"),
client = require("./clnt")


if(window.top == window.self) {
	console.log("waiting for dom ready");
	domReady(client.start);
}