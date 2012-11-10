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

		var id = "flash_" + (_id++);

		this.$().attr("id", id)

		swfobject.embedSWF(this.get("src") || this.get("source"), 
		id,
		"100%",
		"100%",
		"9.0.0",
		"/swf/expressInstall.swf",
		JSON.parse(JSON.stringify(this.get("params"))), {
			bgcolor: "#FFFFFF"
		});	
	}
});