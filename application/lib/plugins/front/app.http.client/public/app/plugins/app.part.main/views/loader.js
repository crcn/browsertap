var _s = require("underscore.string");

module.exports = require("../../../views/base").extend({
	"templateName": "app-loader",
	"initialize": function() {
		module.exports.__super__.initialize.call(this);
		
		var self = this, cp = 0;

		function onState(state) {

			if(state.p < cp) {
				$(self.el).find("#progress").css({width:0});
			}
			cp = state.p;

			$(self.el).find("#progress").transit({ width: (state.p * 100) + "%"});
		}

		this.options.states.on("state", onState);
	},
	"showNotification": function() {
		if(this._showing) return;
		this._showing = true;
		$(self.el).find("#progress").css({ width: "200px" });
		$(this.el).css({opacity:0, scale:0.75, display:"block"});
		$(this.el).transit({opacity:0.85, scale:1 }, 500, "ease");
		return this;
	},
	"update": function(data) {
		if(!data) data = {};
		var img = data.app ? "/img/apps/"+encodeURIComponent(data.app.toLowerCase())+".png" : null, self = this,
		$ic = $(self.el).find("#icon-inner-container");//.css({ "visibility": "hidden" });


		$(this.el).find("img").attr("src", img).one("load", function() {
			$ic.css({ "visibility": "visible" }).width($(this).width()).height($(this).height());
		})
		$(this.el).find("#progress").css({ "background-image": "url("+img+")"});
		$(this.el).find("#progress-text").text(_s.titleize(data.app) +" "+data.version);

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