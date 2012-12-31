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

		swfobject.embedSWF(this.src || this.source, 
		$(this.el).attr("id"),
		"100%",
		"100%",
		"9.0.0",
		"/swf/expressInstall.swf",
		JSON.parse(JSON.stringify(this.params())), {
			backgroundColor: "#FFFFFF"
		});	
	},
	"params": function() {
		return {};
	}
})