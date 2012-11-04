var BrowserNotification = require("./browserNotification"),
BrowswerNotificationBg  = require("./browserNotificationBg");

module.exports = Ember.ContainerView.extend({

	/**
	 */

	"init": function() {
		this._super();
		var cv = this.get("childViews");
		cv.pushObject(this._bg = BrowswerNotificationBg.create());
		cv.pushObject(this._note = BrowserNotification.create());
	},
	"showNotification": function() {
		this._bg.showNotification();
		this._note.showNotification();
	},
	"updateBrowserInfo": function(info) {
		this._note.updateBrowserInfo(info);
	},
	"hideNotification": function() {
		this._bg.hideNotification();
		this._note.hideNotification();
	}
});