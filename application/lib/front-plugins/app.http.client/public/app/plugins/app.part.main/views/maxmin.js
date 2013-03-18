module.exports = require("../../../views/base").extend({
	"events": {
		"click": "toggleExpand"
	},
	"initialize": function() {
		this._usePadding = true;
		this.rerender();
		module.exports.__super__.initialize.call(this);
	},
	"toggleExpand": function() {
		this._usePadding = !this._usePadding;
		this.rerender();
		if(this.onExpandContract) this.onExpandContract(this._usePadding);
	},
	"_imgSrc": function() {
		return "/img/icons/" + (this._usePadding ? "contract" : "expand") + ".png"
	},
	"rerender": function() {
		this.$el.html("<img src='"+this._imgSrc()+"'>");
	}
});