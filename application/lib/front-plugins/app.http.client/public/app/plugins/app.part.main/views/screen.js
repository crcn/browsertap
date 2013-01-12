var Loader = require("./loader"),
DesktopPlayer = require("./desktopPlayer"),
wkmEvents = require("./events"),
disposable = require("disposable"),
_ = require("underscore");

module.exports = require("../../../views/base").extend({
	"templateName": "screen",
	"initialize": function() {
		module.exports.__super__.initialize.call(this);

		var loader = this.options.loader,
		disp = this._disposable = disposable.create(), self = this;

		this._window = this.options.window;
		this.$hud = this.$el;
		this.$hudBody = this.$el.find(".hud-body");
		this.$window = $(window);
		this.$html = $("html");
		this.$document = $(document);
		this.$body = $(document.body);
		this.$cover = this.$el.find(".screen-cover");
		this.coords = {};
		this.windowDims = {};
		this._frameRates = 0;
		this._numFrameRates = 0;
		this._locked = true;
		this._usePadding = false;
		this.resizable = !!this._window.style.sizebox;

		var self = this;


		var agent = String(window.navigator.userAgent).toLowerCase();

		this._scrollMultiplier = 100;

		//firefox allows for right-click disable on element, but NEEDS a cover to 
		//listen for mouse events
		if(!~agent.indexOf("firefox")) {
			$(".screen-cover").remove();
			// this._scrollMultiplier = 20;
		}

		//chrome's scroll delta is way the fuck off from everything else
		if(~agent.indexOf("safari")) {
			// this._scrollMultiplier = 1;
		}

		disp.add(
			loader.on("setClipboard", function(text) {
				$(".hud-body").find("object")[0].setClipboard(text);
			}),
			loader.on("focus", function() {
				self._numFrameRates = self._frameRates = 0;
			}),
			loader.on("unfocus", function() {
				self._numFrameRates = self._frameRates = 0;
			})/*,
			loader.on("locationChange", function() {
				self._useNativeScroller = false;
				console.log($("body"))
				$("body").css({"overflow": "hidden" });
				self.onResize();
			})*/
		);

		_.each(this._createBindings(), function(binding) {
			disp.addBinding(binding);
		});

		this.$hudBody.css({ opacity: 0 });


		this._disposable.addInterval(setInterval(_.bind(this.syncScrollInfo, this), 2000));
		this._disposable.addInterval(setInterval(_.bind(this._changeVideoQuality, this), 200));
		this._window.bindProxy(_.bind(this.onProxy, this));

		//do NOT resize before the first framerate arrives. This causes a delay
		this.onResize(false, false);
		this._listenToWindow();
		this._keysDown = [];
	},
	"usePadding": function(value) {
		this._usePadding = value;
		if(!this._locked) this.onResize();
	},
	"prepareChildren": function() {
		return [
			this._desktopPlayer = new DesktopPlayer({ el: ".desktop-player", host: this.options.rtmpUrl, onFlashBlockerDetected: _.bind(this._onFlashBlockerDetected, this) })
		];
	},

	/**
	 */

	"_onFlashBlockerDetected": function() {
		this.$hudBody.css({ opacity: 1 });	
		if(this.onReady) this.onReady();
	},


	/**
	 */

	"_createBindings": function() {
		return [
			this.$window.resize(_.bind(this.onResize, this)),
			this.$window.mousewheel(_.throttle(_.bind(this.onDocumentScroll, this), 30)),
			this.$window.mousedown(_.bind(this.onMouseDown, this)),
			this.$window.mouseup(_.bind(this.onMouseUp, this)),
			this.$window.mousemove(_.throttle(_.bind(this.onMouseMove, this), 50)),
			this.$window.keydown(_.bind(this.onWindowKeyDown, this)),
			this.$window.keyup(_.bind(this.onWindowKeyUp, this)),
			this.$window.scroll(_.bind(this.onWindowScroll, this))
		];
	},
	"_listenToWindow": function() {


		window.desktopEvents = {
			setClipboard: _.bind(this.setClipboard, this),
			//keyDown: _.bind(this.onKeyDown, this),
			resize: _.bind(this.onWindowResize, this),
			framerateChange: _.bind(this.onFrameRateChange, this)
		};
	},
	"onWindowKeyDown": function(e) {

		console.log("KEY")


		e.preventDefault();
		e.stopPropagation();

		this._keysDown[e.keyCode] = true;

		if(~[17, 16, 18, 91].indexOf(e.keyCode)) return;


		this._window.keybdEvent({
			keyCode: e.keyCode,
			altKey: e.altKey,

			//windows or mac
			ctrlKey: e.ctrlKey || !!this._keysDown[91],
			shiftKey: e.shiftKey
		});

	},
	"onWindowKeyUp": function(e) {

		delete this._keysDown[e.keyCode];
	},
	"dispose": function() {
		module.exports.__super__.dispose.call(this);
		this._disposable.dispose();
	},
	"onWindowScroll": _.throttle(function() {
		this._scrollDelta = 1;
		if(!this._useNativeScroller || true) return;

		this.proxy.scrollbar.to(this.$document.scrollLeft(), this.$document.scrollTop());
	}, 30),
	"onResize": _.debounce(function(force, sendToServer) {
		var win = this._window,
		padding = _.extend({}, win.app.padding),
		self    = this;

		self._realPadding = padding;

		this._locked = false;


		if(this.options.loader.options.screen || !this._usePadding) {
			padding.top = 22;
			padding.left = 4;
			padding.right = 4;
			padding.bottom = 4;
		}

		this.$hudBody.css({
			width: this.$window.width() + (padding.left || 0) + (padding.right || 0) + (this._useNativeScroller ? 17 : 0),
			height: this.$window.height() + (padding.top || 0) + (padding.bottom || 0),
			left: -padding.left,
			top: -padding.top,
			position: "absolute"
		});

		this.$hud

		var w = this.$hudBody.width(),
		h = this.$hudBody.height();

		try {
			$(".hud-body").find("object")[0].setPadding(padding);
			// $(".hud-body").find("object").refresh();
		} catch(e) {
			
		}

		if(sendToServer === false) return;
		//don't resize if nothing's changed
		if(!this.resizable) return win.resize(0, 0, win.width, win.height);
		if(!force && win.width == w && win.height == h) return;


		win.resize(0, 0, w, h);
	}, 500),
	"onMouseMove": function(e) {

		this._lastMouseMoveAt = Date.now();

		var padding = this._realPadding || this._window.app.padding;



		var coords = { x: e.pageX + (padding.left || 0) - this.$document.scrollLeft(), y: e.pageY + (padding.top || 0)  - this.$document.scrollTop() - this.$hud.offset().top };

		if(this.windowDims.width && this.windowDims.height) {
			coords.x = coords.x - (this.$hudBody.width()/2 - this.windowDims.width/2);
			coords.y = coords.y - (this.$hudBody.height()/2 - this.windowDims.height/2);
		}


		if(this.coords) {
			this._mouseMoveDelta = Math.round(Math.sqrt(Math.pow(this.coords.x - coords.x, 2) + Math.pow(this.coords.y - coords.y, 2)))
		}

		this._window.mouseEvent(wkmEvents.mouse.MOUSEEVENTF_ABSOLUTE | wkmEvents.mouse.MOUSEEVENTF_MOVE, this.coords = coords);
	},
	"onMouseDown": function(e) {

		//is scrollbar
		if(e.toElement == this.$html[0]) return;
		this._mouseDown = true;

		/*console.log("DOWN");
		console.log(e.target);
		console.log(e);
		console.log(e.toElement == this.$html[0])
		console.log(this.$html)*/

		this._window.mouseEvent(e.button == 0 ? wkmEvents.mouse.MOUSEEVENTF_LEFTDOWN : wkmEvents.mouse.MOUSEEVENTF_RIGHTDOWN, this.coords);

		/*if(e.button == 0) {
			mixpanel.track("Right Click");
		} else {
			mixpanel.track("Left Click");
		}*/

		if(e.button === 0) return; //only block right click
		e.preventDefault();
		e.stopPropagation();
		return false;
	},
	"onMouseUp": function(e) {
		if(e.toElement == this.$html[0]) return;
		this._mouseDown = false;
		this._window.mouseEvent(e.button == 0 ? wkmEvents.mouse.MOUSEEVENTF_LEFTUP : wkmEvents.mouse.MOUSEEVENTF_RIGHTUP, this.coords);
	},
	"onKeyDown": function(data) {
		if(~[17, 16, 18].indexOf(data.keyCode)) return;
		this._window.keybdEvent(data);
	},
	"onWindowResize": function(data) {

		this.windowDims = data;
		if(this._hudVisible) return;

		if(this.resizable) {
			if(this._locked) return;
			if(this.$hudBody.width() > data.width || this.$hudBody.height() > data.height) return;
		}

		this._hudVisible = true;

		if(this.onReady) this.onReady();

		//wait for the rtmp stream to catch up
		setTimeout(function(self) {
			self.$hudBody.css({ opacity: 0 });
			self.$hudBody.transit({ opacity: 1 }, 2000);
		}, 500, this);

	},
	"onProxy": function(proxy) {
		this.proxy = proxy;
	},
	"onDocumentScroll": function(e, delta, deltaX, deltaY) {
		this._scrollDelta = delta;


		if(this._useNativeScroller) return;


		var self = this;

		function scroll(type, delta) {
			self._window.mouseEvent(type, self.coords, delta * self._scrollMultiplier);
		}

		if(Math.abs(deltaY) > 0) scroll(wkmEvents.mouse.MOUSEEVENTF_WHEEL, deltaY);
		if(Math.abs(deltaX) > 0) scroll(wkmEvents.mouse.MOUSEEVENTF_HWHEEL, deltaX);
	},
	"syncScrollInfo": function() {
		if(!this.proxy || true) return;
		var self = this;
		this.proxy.scrollbar.getPosition(function(x, y) {
			// $("#scroller").width(x);


			$("#scroller").height(y);
			$("body").css({ "overflow": "auto" });
			self._useNativeScroller = true;
			self.onResize();
		});
	},
	"setClipboard": function(text) {
		this._window.setClipboard(text);
	},
	"onFrameRateChange": _.throttle(function(frameRate) {

		//first framerate? sweet. the remote desktop is sending
		//an image. Now, hard refresh this shit to bypass the gop_size issue ~
		//the screen won't be usable until the user resizes the window, or waits for N seconds
		if(!this._refreshedHard) {
			this._refreshedHard = true;
			this.onResize(true);
		}

		if(frameRate == 0) {
			console.log("framerate is 0");
			return;
		}

		if(this._numFrameRates > 10) {
			this._trackFrameRate();
			this._frameRates = 0;
			this._numFrameRates = 0;
		}

		this._frameRates += frameRate;
		this._numFrameRates++;
		this._avgFrameRate = Math.round(this._frameRates / this._numFrameRates);

		console.log("avg frame rate:", this._avgFrameRate);
	}, 1000 * 3),
	"_trackFrameRate": function() {
		if(!this.options.loader.focused) {
			console.log("window not in focus, not broadcasting fps metrics");
		}
		this.options.loader._trackBrowser("Average Frame Rate", { 
			actual_frame_rate: this._avgFrameRate, 
			qmin: this.options.qmin, 
			qmax: this.options.qmax,
			stage_width: this.$el.width(),
			stage_height: this.$el.height(),
			gop_size: this.options.gop_size,
			frame_rate: this.options.frame_rate
		});
	},
	"_changeVideoQuality": function() {

		if(this._locked) return;

		var mouseMoveDelta = this._mouseDown ? this._mouseMoveDelta || 1 : 0;

		var biggest = Math.round(Math.max(mouseMoveDelta, Math.abs(this._scrollDelta || 0) * 200));


		var qmin, qmax, gop_size;

		if(biggest > 0) {
			qmin = 20;
			qmax = 60;
			gop_size = 300;
		} else {
			qmin = 1;
			qmax = 4;
			gop_size = 60;
		}

		this._mouseMoveDelta = 0;
		this._scrollDelta = 0;


		if(this.qmin == qmin && this.qmax == qmax) return;

		this.qmin = qmin;
		this.qmax = qmax;


		// var qmax = Math.min(biggest, 70),
		// qmin = 1;//Math.max(qmax - 20, 1);

		// console.log(qmin, qmax)

		this._window.changeRecordingQuality({ qmin: qmin, qmax: qmax, gop_size: gop_size })
	}
});