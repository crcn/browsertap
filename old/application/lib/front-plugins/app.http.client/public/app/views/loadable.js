module.exports = require("./base").extend({
	"render": function() {
		this.load();
	},
	"render2": function() {
		module.exports.__super__.render.call(self);
	},
	"load": function(callback) {
		var self = this;
		this.loader.load(function() {
			self._onLoaded();
			self.render2();
			if(callback) callback();
		})
	},
	"_onLoaded": function() {

	}
});