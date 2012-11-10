module.exports = require("./flashPlayer").extend({
	"source": "/swf/DesktopPlayer.swf",
	"elementId": "desktop-player",
	"init": function() {
		this._super();
		this.set("params", Ember.Object.create({
			host: "http://localhost",
			debug: true
		}));
	},
	"_onRtmpUrlChange": function() {
		console.log("G")
		this.render();
	}.observes("params.host")
});

