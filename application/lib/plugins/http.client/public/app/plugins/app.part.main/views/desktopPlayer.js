module.exports = require("./flashPlayer").extend({
	"source": "/swf/DesktopPlayer.swf",
	"elementId": "desktop-player",
	"init": function() {
		this._super();
		this.set("params", Ember.Object.create({
			host: "http://localhost",
			debug: true
		}));
		this.get("params").addObserver("host", this, "_onRtmpUrlChange");
	},
	"_onRtmpUrlChange": function() {
		this.render();
	}
});