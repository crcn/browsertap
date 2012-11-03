var Url = require("url");


window.App = Em.Application.create({
	//"rootElement": "#someId"
});


var info = Url.parse(String(window.location))

window.App.DesktopClient = require("./views/desktopClient").extend({
	service: {
		host: "http://"+info.hostname+":" + (Number(info.port || 80)) + "/dnode"
	}
})

