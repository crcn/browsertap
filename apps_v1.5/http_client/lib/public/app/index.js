
window.App = Em.Application.create({
	//"rootElement": "#someId"
});


window.App.DesktopClient = require("./views/desktopClient").extend({
	service: {
		host: "http://192.168.2.2:8082/dnode"
	}
})

