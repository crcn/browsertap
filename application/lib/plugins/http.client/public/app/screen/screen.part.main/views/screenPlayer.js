module.exports = require("./flashPlayer").extend({
	"source": "/swf/DesktopPlayer.swf",
	"elementId": "desktop-player",
	"init": function() {
		this._super();
		this.set("params", Ember.Object.create({
			host: "http://localhost"
		}));
		console.log(this.get("host"))
	},
	"_onRtmpUrlChange": function() {
		var host = this.get("host"),
		hp = host.split("/"),
		channel = hp.pop(),
		url = hp.join("/");

		this.set("params.host", url);
		this.set("params.channel", channel);
		this.render();
	}.observes("host")
});

