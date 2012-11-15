var _ = require("underscore"),
getPadding = require("./getPadding"),
wkmEvents = require("./events");


module.exports = Ember.View .extend({
	"templateName": "screen",
	"classNames": ["hud", "hidden"],
	"init": function() {
		this._super();
		Ember.Binding.fn(this, "_onWindow", "window");
		Ember.Binding.fn(this, "_onControllerWindow", "controller.content.mainWindow");
	},
	"_onControllerWindow": function(win) {
		if(win) this.set("window", win);
	},
	"didInsertElement": function() {
		this._inserted = true;
		this._onWindow(this.get("window"));
	},
	"_onWindow": function(win) {
		if(!win || !this._inserted) return;
		var padding = getPadding(win),
		self = this;

		var $hud = this.$().find(".hud-body"),
		$el = this.$();


		$hud.css({left: -padding.left, top: -padding.top, "position": "fixed"})
		$el.css({opacity:1, width: "100%", height: "100%" });


		function onResize() {
			var w = $el.width() + (padding.left + padding.right),
			h = $el.height() + (padding.top + padding.bottom);
			$hud.width(w);
			$hud.height(h);


			//don't resize if nothing's changed
			if(win.width == w && win.height == h) return;

			win.resize(0, 0, w, h);
		}
	
		$(window).resize(_.debounce(onResize, 200));
		onResize();
		setTimeout(onResize, 1000);

		win.startRecording(function(err, info) {
			win.set("host", info.url);
		});

		var header = $el.find(".hud-header"),
		drag = false,
		coords = {};

		$el.mousemove(_.throttle(function(e) {
			win.mouseEvent(wkmEvents.mouse.MOUSEEVENTF_ABSOLUTE | wkmEvents.mouse.MOUSEEVENTF_MOVE, coords = { x: e.offsetX, y: e.offsetY });
		}, 100));


		$el.mousedown(function(e) {
			win.mouseEvent(e.button == 0 ? wkmEvents.mouse.MOUSEEVENTF_LEFTDOWN : wkmEvents.mouse.MOUSEEVENTF_RIGHTDOWN, coords);

			if(e.button === 0) return; //only block right click
			e.preventDefault();
			e.stopPropagation();
		});

		$el.mouseup(function(e) {
			win.mouseEvent(e.button == 0 ? wkmEvents.mouse.MOUSEEVENTF_LEFTUP : wkmEvents.mouse.MOUSEEVENTF_RIGHTUP, coords);
		});


		window.desktopEvents = {
			keyDown: function(data) {
				win.keybdEvent(data.keyCode, 0,  wkmEvents.keyboard.KEYEVENTF_EXTENDEDKEY | 0);
			},
			keyUp: function(data) {
				win.keybdEvent(data.keyCode, 0,  wkmEvents.keyboard.KEYEVENTF_EXTENDEDKEY | wkmEvents.keyboard.KEYEVENTF_KEYUP);
			}
		}


		$el.bind("mousewheel", _.throttle(function(e, delta) {
			win.mouseEvent(wkmEvents.mouse.MOUSEEVENTF_WHEEL, coords, delta * 50);
		}, 50));



	}
});
