module.exports = Ember.View.extend({
	"templateName": "app-loader",
	"classNames": ["app-notification"],
	"didInsertElement": function() {
		this._super();
	},
	"showNotification": function(app) {
		var appName = app.split(" ").shift();
		this.set("imgUrl","/img/apps/"+appName.toLowerCase()+".png");
		this.set("app", app.substr(0,1).toUpperCase() + app.substr(1).toLowerCase());
		this.$().css({opacity:0, scale:0.75, display:"block"});
		this.$().transit({opacity:0.85, scale:1, }, 500, "ease");
	},
	"hideNotification": function(callback) {
		var el = this.$();
		this.$().transit({opacity:0, scale: 1.5}, 500, "ease", function() {
			el.css({display:"none"});
			if(callback) callback();
		});
	},
	"_onUrlChange": function() {
	}.observes("controller.app")
});