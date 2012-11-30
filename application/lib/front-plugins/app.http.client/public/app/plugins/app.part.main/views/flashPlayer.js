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