module.exports = require("../../../views/base").extend({
	"templateName": "app-loader",
	"initialize": function() {
		module.exports.__super__.initialize.call(this);
		
		var self = this;

		function onState(state) {
			$(self.el).find("#progress").transit({ width: (state.p * 100) + "%"});
		}

		this.options.states.on("state", onState);
	},
	"showNotification": function() {
		if(this._showing) return;
		this._showing = true;
		$(self.el).find("#progress").css({ width: "0%"});
		$(this.el).css({opacity:0, scale:0.75, display:"block"});
		$(this.el).transit({opacity:0.85, scale:1 }, 500, "ease");
		return this;
	},
	"update": function(data) {
		if(!data) data = {};

		$(this.el).find("img").attr("src", data.app ? "/img/apps/"+data.app.toLowerCase()+".png" : null);
		$(this.el).find("#progress-text").text(data.app.substr(0, 1).toUpperCase() + data.app.substr(1) +" "+data.version)

	},
	"hideNotification": function(callback) {
		if(!this._showing) return;
		this._showing = false;
		var el = $(this.el);
		el.transit({opacity:0, scale: 1.5}, 500, "ease", function() {
			el.css({display:"none"});
			if(callback) callback();
		});
		return this;
	}
});