var DesktopPlayer = require("./desktopPlayer");

module.exports = Ember.ContainerView.extend({

	/**
	 */

	"templateName": "main",

	/**
	 */

	"init": function() {
		this._super();

		this.get("childViews").pushObject(DesktopPlayer.create());
	}
});