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
		// this._super.apply(this, arguments);

		var self = this;

		setTimeout(function() {
			self._render();
		}, 500)
	},


	/**
	 */

	"_render": function() {
		swfobject.embedSWF(this.get("src") || this.get("source"), 
		this.get("elementId"),
		"100%",
		"100%",
		"9.0.0",
		"/swf/expressInstall.swf",
		JSON.parse(JSON.stringify(this.get("params"))), {
			bgcolor: "#FFFFFF"
		});	
	}
});