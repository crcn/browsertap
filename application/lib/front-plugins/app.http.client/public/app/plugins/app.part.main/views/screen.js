var Loader = require("./loader"),
DesktopPlayer = require("./desktopPlayer"),
getPadding = require("./getPadding"),
wkmEvents = require("./events"),
Url = require("url");

module.exports = require("../../../views/base").extend({
	"templateName": "screen",
	"initialize": function() {
		module.exports.__super__.initialize.call(this);
		this.options.loader.bindWindow(_.bind(this._onWindow, this));

		var loader = this.options.loader,
		lv = this._loaderView;
		loader.on("loading", function() {
			lv.update({ app: loader.options.app });
			lv.showNotification();

		});

		loader.on("window", function() {
			lv.hideNotification();
		})
	},
	"_onConnection": function(connection) {
		connection
	},
	"prepareChildren": function() {
		return [
			this._loaderView = new Loader({ app:"chrome", el: ".loader" }),
			this._desktopPlayer = new DesktopPlayer({ el: ".desktop-player" })
		];
	},
	"_onWindow": function(win) {
		var padding = getPadding(win),
		self = this,
		baseQual = {
			qmin: 1,
			qmax: 11,
			gop_size: 10
		},
		minQual = {
			qmin: 10,
			qmax: 51,
			gop_size: 300
		}

		var $hud = $(this.el).find(".hud-body"),
		$el = $(this.el);

		//TODO
		/*setTimeout(function() {
			padding = {left:0,right:0,top:18,bottom:0};
			// $hud.transit({ left: 0, right: $(document).width(), top: 0, height: $(document).height() }, 500, "ease", onResize);
			onResize();
		}, 5000);*/



		function onResize() {

			$el.css({
				opacity: 1,
				width: $(document).width() + padding.left + padding.right,
				height: $(document).height() + padding.top + padding.bottom,
				left: -padding.left,
				top: -padding.top,
				position: "fixed"
			});

			var w = $el.width(),
			h = $el.height();
			$hud.width(w);
			$hud.height(h);



			//don't resize if nothing's changed
			if(win.width == w && win.height == h) return;

			win.resize(0, 0, w, h);
		}

		function scaleQuality() {
			//TODO
		}

		$(window).resize(_.debounce(onResize, 200));
		onResize();
		setTimeout(onResize, 1000);

		var q = Url.parse(String(window.location), true).query,
		defaults = { qmin: 1, qmax: 11, gop_size: 150, frame_rate: 25 };

		for(var key in defaults) {
			if(q[key]) q[key] = Number(q[key]);
			else q[key] = defaults[key];
		}

		win.startRecording(q, function(err, info) {
			self._desktopPlayer.update({ host: info.url });
		});

		var coords = {};


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

		var modifiers = [17, 16, 18];
		/*var replModifiers = { 91: };

		$el.keydown(function(e) {
			if(~modifiers.indexOf(e.keyCode)) return;

			win.keybdEvent({
				keyCode: e.keyCode,
				altKey: e.altKey,
				ctrlKey: e.ctrlKey,
				shiftKey: e.shiftKey
			});
		})*/


		window.desktopEvents = {
			keyDown: function(data) {
				if(~modifiers.indexOf(data.keyCode)) return;
				win.keybdEvent(data);
			}/*,
			keyUp: function(data) {
				win.keybdEvent(data.keyCode, 0,  wkmEvents.keyboard.KEYEVENTF_EXTENDEDKEY | wkmEvents.keyboard.KEYEVENTF_KEYUP);
			}*/
		}


		$el.bind("mousewheel", _.throttle(function(e, delta) {
			win.mouseEvent(wkmEvents.mouse.MOUSEEVENTF_WHEEL, coords, delta * 50);
		}, 50));
	}
});