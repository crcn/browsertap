module.exports = Ember.View.extend({
	"templateName": "browser-notification",
	"classNames": ["browser-notification"],
	"didInsertElement": function() {
		this._super();
		this.showNotification();
	},
	"showNotification": function() {
		this.$().css({scale:0.75});
		this.$().transit({opacity:0.85, scale:1}, 500, "ease");
	},
	"hideNotification": function() {
		this.$().transit({opacity:0, scale: 1.5}, 500, "ease");
	},
	"updateBrowserInfo": function(options) {
		this.set("imgPath", "/img/browsers/" + options.name + ".png");
		this.set("version", options.version);
	}
});
