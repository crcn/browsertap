var LoaderView = require("./loader"),
_ = require("underscore")

module.exports = Ember.ContainerView.extend({
	"init": function() {
		this._super();
		var children = this.get("childViews");
		children.pushObject(this._loading = LoaderView.create());
	},
	"didInsertElement": function() {
		Ember.Binding.fn(this, "_onLoading", "controller.content.loading");

		this.get("childViews").pushObject(ScreensView.create({ content: this.get("controller.content.windows") }));
	},
	"_onLoading": function(loading) {
		if(loading) {
			this._loading.showNotification(this.get("controller.content.app"));
		} else {
			this._loading.hideNotification();
		}
	},
	"_onLoadingChange": function() {
		console.log(arguments);
	}
});


var ScreensView = Ember.CollectionView.extend({
	itemViewClass: require("./screen")
});
