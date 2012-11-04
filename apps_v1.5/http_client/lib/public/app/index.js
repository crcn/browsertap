var Url = require("url"),
_       = require("underscore"),
BrowserNotification = require("./views/browserNotificationContainer"),
DesktopClient = require("./views/desktopClient");


window.App = Em.Application.create({
	//"rootElement": "#someId"
});

var info = Url.parse(String(window.location));
var host  = "http://"+info.hostname+":" + (Number(info.port || 80)) + "/dnode";


var RootView = Ember.ContainerView.extend({
	"init": function() {
		this._super();

		var notification = BrowserNotification.create();

		var desktop = DesktopClient.create({
			service: { host: host },
			notifications: notification
		});

		var children = this.get("childViews");

		children.pushObject(desktop);
		children.pushObject(notification);

	}
});



var views = {
	RootView: RootView
}


_.extend(window.App, views);

