var _id = 0;

module.exports = require("../../../views/base").extend({
	"templateName": "flash-player",
	"render": function() {
		module.exports.__super__.render.call(this);
		
		if(!this._rendered) {	
			this._rendered = true;
			var id = "flash_" + (_id++);
			$(this.el).attr("id", id);
		}

		/*var url = (this.params().host + "/" + this.params().channel).replace("rtmp://", "http://").replace(1935, 9999);

		alert(url);

		$(this.el).html('<video source="'+url+'.m3u8" width="1024" height="768"></video>');*/

		$el = $(this.el);

		var self = this;

		swfobject.embedSWF(this.src || this.source, 
		$el.attr("id"),
		"100%",
		"100%",
		"9.0.0",
		"/swf/expressInstall.swf",
		JSON.parse(JSON.stringify(this.params())), {
			backgroundColor: "#FFFFFF",
			"menu":false
		}, {
			"wmode": "transparent",
			"menu": false
		}, function() {

			//beat the race condition
			setTimeout(function() {

				//check if clickToFlash is installed on the system. If PercentLoaded can't be called, then it is.
				try {
					$("#"+id)[0].PercentLoaded();
				} catch(e) {
					analytics.track("Flash Blocker Detected");
					console.error("flash blocker detected");
					if(self.options.onFlashBlockerDetected) {
						self.options.onFlashBlockerDetected();
					}
				}
			}, 1000);
		});	


	},
	"params": function() {
		return {};
	}
})