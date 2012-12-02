var FlashPlayer = require("./flashPlayer");
module.exports = FlashPlayer.extend({
	"source": "/swf/DesktopPlayer.swf",
	"host": "http://localhost:1935/live/default",
	"params": function() {

		var host = this.options.host || this.host;
		console.log("connecting to stream %s", host);
		var hp = String(host).split("/");

		return {
			channel: hp.pop(),
			host: hp.join("/"),
			// debug: true,//~String(window.location).indexOf("debugMode")
		};
	}
});