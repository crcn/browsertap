var structr = require("structr"),
Client = require("./client"),
logger = require("winston").loggers.get("nativeWindows"),
sprintf = require("sprintf").sprintf;


module.exports = structr({

	/**
	 */

	"__construct": function(controller, wkm) {
		this._queuedNativeWindows = [];
		this._toPopUp = [];
		this.wkm = wkm;
		this.controller = controller;

		wkm.windows.on("open", this.getMethod("_onOpenWindow"));
		wkm.windows.on("close", this.getMethod("_onCloseWindow"));
		wkm.windows.on("setClipboard", this.getMethod("_setClipboard"));
	},

	/**
	 */

	"addNativeWindow": function(win) {
		logger.info(sprintf("add native window %s", win.id));

		for(var i = this.controller.clients.length; i--;) {
			var cw = this.controller.clients[i];
			if(cw.windows.bindNativeWindow(win)) {
				return true;
			}
 		}


		this._queuedNativeWindows.push(win); 
		
 		logger.info("failed to bind to client, popping up")

		for(i = this.controller.clients.length; i--;) {
			if(this.controller.clients[i].windows.popupWindow(win)) return;
		}
	},

	/**
	 * called when a new client window has been created
	 */

	"tryBindingNativeWindow": function(cwin) {
		for(var i = this._queuedNativeWindows.length; i--;) {
			var qw = this._queuedNativeWindows[i];
			if(cwin.bindNativeWindow(qw)) {
				this._queuedNativeWindows.splice(i, 1);
				return;
			}
		}

		for(i = this._queuedNativeWindows.length; i--;) {
			cwin.popup(this._queuedNativeWindows[i]);
		}
	},

	/**
	 */

	"_onOpenWindow": function(win) {
		if(!win.app) {
			return console.warn("cannot add \"%s\" - no app found", win.title);
		}
		this.addNativeWindow(win);
	},

	/**
	 */

	"_onCloseWindow": function(win) {
		var i = this._queuedNativeWindows.indexOf(win);
		if(~i) this._queuedNativeWindows.splice(i, 1);
	},

	"_setClipboard": function(data) {
		if(this.controller.clients.length) {
			console.log("sending clipboard to client");
			this.controller.clients[0].windows.setClipboard(data);
		}
	}
});