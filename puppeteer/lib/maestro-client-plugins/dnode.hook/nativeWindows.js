var structr = require("structr"),
ClientWindows = require("./clientWindows"),
logger = require("winston").loggers.get("nativeWindows"),
sprintf = require("sprintf").sprintf;


module.exports = structr({

	/**
	 */

	"__construct": function(wkm) {
		this._connections = [];
		this._queuedNativeWindows = [];
		this._toPopUp = [];

		wkm.windows.on("open", this.getMethod("_onOpenWindow"));
		wkm.windows.on("close", this.getMethod("_onCloseWindow"));
		wkm.windows.on("setClipboard", this.getMethod("_setClipboard"));
	},

	/**
	 */

	"addNativeWindow": function(win) {
		logger.info(sprintf("add native window %s", win.id));

		for(var i = this._connections.length; i--;) {
			var cw = this._connections[i];
			if(cw.bindNativeWindow(win)) {
				return true;
			}
 		}


		this._queuedNativeWindows.push(win); 
		
 		logger.info("failed to bind to client, popping up")

		for(i = this._connections.length; i--;) {
			if(this._connections[i].popupWindow(win)) return;
		}



	},

	/**
	 */

	"getClientWindows": function(con) {
		var client = new ClientWindows(this, con),
		self = this;
		client.once("close", function() {
			self._connections.splice(self._connections.indexOf(client), 1);
		});
		this._connections.push(client);
		return client;
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
		this.addNativeWindow(win);
	},

	/**
	 */

	"_onCloseWindow": function(win) {
		var i = this._queuedNativeWindows.indexOf(win);
		if(~i) this._queuedNativeWindows.splice(i, 1);
	},

	"_setClipboard": function(data) {
		if(this._connections.length) {
			console.log("sending clipboard to client");
			this._connections[0].setClipboard(data);
		}
	}
});