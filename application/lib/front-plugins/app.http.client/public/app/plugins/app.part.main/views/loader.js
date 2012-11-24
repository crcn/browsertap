module.exports = require("../../../views/base").extend({
	"templateName": "app-loader",
	"showNotification": function() {
		$(this.el).css({opacity:0, scale:0.75, display:"block"});
		$(this.el).transit({opacity:0.85, scale:1 }, 500, "ease");
		return this;
	},
	"hideNotification": function(callback) {
		var el = $(this.el);
		el.transit({opacity:0, scale: 1.5}, 500, "ease", function() {
			el.css({display:"none"});
			if(callback) callback();
		});
		return this;
	},
	"templateData": function() {
		var data = this.data();

		if(!data.app) return {
			"imgSrc": "",
			"app": ""
		};
		
		return {
			"imgSrc": "/img/apps/"+data.app.toLowerCase()+".png",
			"app": data.app.substr(0,1).toUpperCase() + data.app.substr(1).toLowerCase() + " " + data.version
		};
	}
});