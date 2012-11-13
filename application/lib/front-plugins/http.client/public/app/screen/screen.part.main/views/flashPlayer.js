var _id = 0;

module.exports = Ember.View.extend({

	/**
	 */

	"templateName": "flash-player",

	/**
	 */

	"params": { },

	/**
	 */

	"init": function() {
		this._super();

	},

	/**
	 */

	"render": function() {
		var self = this;

		setTimeout(function() {
			self._render();
		}, 500)
	},

	/**
	 */

	"_render": function() {
		console.log(this.get("params.host"))


		if(!this._rendered) {	
			this._rendered = true;
			var id = "flash_" + (_id++);
			this.$().attr("id", id);
		}

		swfobject.embedSWF(this.get("src") || this.get("source"), 
		this.$().attr("id"),
		"100%",
		"100%",
		"9.0.0",
		"/swf/expressInstall.swf",
		JSON.parse(JSON.stringify(this.get("params"))), {
			bgcolor: "#00000"
		});	
	}
});