var domReady = require("domready"),
client = require("./client")


if(window.top == window.self) {
	domReady(client.start);
}


