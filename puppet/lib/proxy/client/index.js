var domReady = require("domready"),
client = require("./clnt")


if(window.top == window.self) {
	domReady(client.start);
}


