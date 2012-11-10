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

var _zIndex = 99;

var ScreenView = Ember.View .extend({
	"templateName": "screen",
	"classNames": ["hud", "hidden"],
	"init": function() {
		this._super();
	},
	"didInsertElement": function() {
		this._super();

		var win = this.get("content");

		this.$().css({opacity:0, scale:0.5, width: win.width, height: win.height });
		var self = this;
		this.$().transit({opacity:1, scale:1.05 }, 200, "ease-out", function() {
			self.$().transit({ scale: 1 }, 200, "ease");
		});

		this.$().offset({ left: Math.random() * ($(window).width() - win.width),
			top: Math.max(Math.random() * ($(window).height() - win.height), 0) });


		win.startRecording(function(err, info) {
			win.set("host", info.url);
		});

		var header = this.$().find(".hud-header"),
		drag = false;

		this.$().mousedown(function() {
			self.$().css({"z-index": _zIndex++ });
		})

		header.mousedown(function(o) {
			drag = true;


			var mouseMove = $(document).mousemove(_.throttle(function(e) {
				self.$().css({ left: e.pageX - o.offsetX, top: e.pageY - o.offsetY })
			}, 1));

			$(document).mouseup(function() {
				mouseMove.unbind();
			})
		});


	}
});

var ScreensView = Ember.CollectionView.extend({
	itemViewClass: ScreenView
});
