var _ = require("underscore"),
getPadding = require("./getPadding"),
wkmEvents = require("./events");

var _zIndex = 99;

module.exports = Ember.View .extend({
	"templateName": "screen",
	"classNames": ["hud", "hidden"],
	"init": function() {
		this._super();
	},
	"didInsertElement": function() {
		this._super();
		var win = this.get("content"),
		padding = getPadding(win),
		self = this;

		console.log(padding)

		var $hud = this.$().find(".hud-body"),
		$el = this.$();

		console.log(win)


		$hud.css({left: -padding.left, top: -padding.top, "position": "fixed"})
		$el.css({opacity:1, width: "100%", height: "100%" });
		
		/*$el.transit({opacity:1, scale:1.05 }, 200, "ease-out", function() {
			$el.transit({ scale: 1 }, 200, "ease");
		});*/

		function onResize() {
			var w = $el.width() + padding.left + padding.right,
			h = $el.height() + padding.top + padding.bottom;
			$hud.width(w);
			$hud.height(h);


			//don't resize if nothing's changed
			if(win.width == w && win.height == h) return;

			win.resize(0, 0, w, h);
		}
	
		$(window).resize(_.debounce(onResize, 200));
		onResize();

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

		$el.keydown(function(e) {
			console.log(e)
		});

		/**
		 *keyDown: function(data) {
				self._keyboardEvent(data.keyCode, 0, 0);
			},
			keyUp: function(data) {
				self._keyboardEvent(data.keyCode, 0, wkmEvents.keyboard.KEYEVENTF_KEYUP);
			},*/


		$el.bind("mousewheel", function(e, delta) {
			win.mouseEvent(wkmEvents.mouse.MOUSEEVENTF_WHEEL, coords, delta * 10);
		})


		/*this.$().mousedown(function() {
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
		});*/


	}
});
