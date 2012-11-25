var Loader = require("./loader"),
DesktopPlayer = require("./desktopPlayer"),
wkmEvents = require("./events"),
disposable = require("disposable");

module.exports = require("../../../views/base").extend({
	"templateName": "screen",
	"initialize": function() {
		module.exports.__super__.initialize.call(this);

		var loader = this.options.loader,
		disp = this._disposable = disposable.create(), self = this;

		this._window = this.options.window;
		this.$hud = this.$el.find(".hud-body");
		this.$window = $(window);
		this.$document = $(document);
		this.$body = $(document.body);
		this.coords = {};
		this.windowDims = {};


		this.$body.css({ "overflow": "hidden" });

		disp.add(
			loader.on("setClipboard", function(text) {
				$(".hud-body").find("object")[0].setClipboard(text);
			})
		);

		_.each(this._createBindings(), function(binding) {
			disp.addBinding(binding);
		});

		this._disposable.addInterval(setInterval(_.bind(this.syncScrollInfo, this)));
		this._window.bindProxy(_.bind(this.onProxy, this));

		this.onResize();
		this._listenToWindow();


	},
	"prepareChildren": function() {
		return [
			this._desktopPlayer = new DesktopPlayer({ el: ".desktop-player", host: this.options.rtmpUrl })
		];
	},
	/**
	 */

	"_createBindings": function() {
		return [
			this.$window.resize(_.bind(this.onResize, this)),
			this.$window.bind("mousewheel", _.throttle(_.bind(this.onDocumentScroll, this), 30)),
			this.$el.mousedown(_.bind(this.onMouseDown, this)),
			this.$el.mouseup(_.bind(this.onMouseUp, this)),
			this.$el.mousemove(_.throttle(_.bind(this.onMouseMove, this), 50))
		];
	},
	"_listenToWindow": function() {

		//TO IMPLEMENT
		/*var self = this;
		setTimeout(function() {

			//never want the chrome at the top
			self._window.app.padding.top = 19 + 4;
			self.onResize();
		}, 5000);*/



		window.desktopEvents = {
			setClipboard: _.bind(this.setClipboard, this),
			keyDown: _.bind(this.onKeyDown, this),
			resize: _.bind(this.onWindowResize, this)
		};
	},
	"dispose": function() {
		module.exports.__super__.dispose.call(this);
		this._disposable.dispose();
	},
	"onResize": _.debounce(function() {
		var win = this._window,
		padding = win.app.padding,
		self    = this;

		if(this.options.loader.options.screen) {
			padding.top = 22;
			padding.left = 4;
			padding.right = 4;
			padding.bottom = 4;
		}

		this.$hud.css({
			opacity: 1,
			width: this.$window.width() + (padding.left || 0) + (padding.right || 0),
			height: this.$window.height() + (padding.top || 0) + (padding.bottom || 0),
			left: -padding.left,
			top: -padding.top,
			position: "fixed"
		});

		var w = this.$hud.width(),
		h = this.$hud.height();


		//don't resize if nothing's changed
		if(win.width == w && win.height == h) return;

		win.resize(0, 0, w, h);
	}, 200),
	"onMouseMove": function(e) {

		var coords = { x: e.offsetX, y: e.offsetY };

		if(this.windowDims.width && this.windowDims.height) {
			coords.x = coords.x - (this.$hud.width()/2 - this.windowDims.width/2);
			coords.y = coords.y - (this.$hud.height()/2 - this.windowDims.height/2);
		}

		this._window.mouseEvent(wkmEvents.mouse.MOUSEEVENTF_ABSOLUTE | wkmEvents.mouse.MOUSEEVENTF_MOVE, this.coords = coords);
	},
	"onMouseDown": function(e) {
		this._window.mouseEvent(e.button == 0 ? wkmEvents.mouse.MOUSEEVENTF_LEFTDOWN : wkmEvents.mouse.MOUSEEVENTF_RIGHTDOWN, this.coords);

		/*if(e.button == 0) {
			mixpanel.track("Right Click");
		} else {
			mixpanel.track("Left Click");
		}*/

		if(e.button === 0) return; //only block right click
		e.preventDefault();
		e.stopPropagation();

	},
	"onMouseUp": function(e) {
		this._window.mouseEvent(e.button == 0 ? wkmEvents.mouse.MOUSEEVENTF_LEFTUP : wkmEvents.mouse.MOUSEEVENTF_RIGHTUP, this.coords);
	},
	"onKeyDown": function(data) {
		if(~[17, 16, 18].indexOf(data.keyCode)) return;
		this._window.keybdEvent(data);
	},
	"onWindowResize": function(data) {
		this.windowDims = data;
		this.onResize();
	},
	"onProxy": function(proxy) {
		this.proxy = proxy;
	},
	"onDocumentScroll": function(e, delta) {
		if(this.proxy) {
			this.proxy.scrollbar.to(this.$document.scrollLeft(), this.$document.scrollTop());
		} else {
			this._window.mouseEvent(wkmEvents.mouse.MOUSEEVENTF_WHEEL, this.coords, delta * 100);
		}
	},
	"syncScrollInfo": function() {
		if(!this.proxy) return;
		var self = this;
		this.proxy.scrollbar.getPosition(function(x, y) {
			// $("#scroller").width(x);
			$("#scroller").height(y);
			self.onResize();
		});
	},
	"setClipboard": function(text) {
		this._window.setClipboard(text);
	}
});