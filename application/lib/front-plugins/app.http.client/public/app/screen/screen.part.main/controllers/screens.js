var step = require("step"),
_ = require("underscore"),
windowStyles = require("../utils/windowStyles");

console.log(window.document.body);
document._test = "abdcd";




module.exports = Ember.ObjectController.extend({
	_onContent: function() {
		this._load();
	}.observes("content"),

	/**
	 */

	"_load": function() {
		this.set("content.loading", true);
		var ar
		this.set("content.windows", ar = this._windows = Ember.ArrayProxy.create({ content: [] }));
		var self  = this,
		puppeteer = this._puppeteer = this.get("content.puppeteer");


		puppeteer.connect(function() {
			self._onConnection(puppeteer.connection);
		});

		var self = this;
	},

	/**
	 */

	"_onConnection": function(connection) {
		this._connection = connection;

		//TODO - check if the connection is the first of the given client. 
		//This is necessary so the app doesn't launch more than one of the same windows

		var self = this,
		app       = this.get("content.app"),
		open      = this.get("content.open");


		connection.events.on("openWindow", function(window) {
			self._onOpenWindow(window);
		});


		connection.events.on("closeWindow", function(window) {
			self._onCloseWindow(window);
		});


		connection.browsers.open(open, app, function() {

			//not needed since _openWindow will be called TWICE
			/*connection.client.windows.getWindows(function(err, windows) {
				self._onWindows(windows);
			});*/	
		});

		
			
	},

	/**
	 */

	"_onOpenWindow": function(w) {
		this.set("content.loading", false);	

		var win = Ember.Object.create(w);

		//if window doesn't have a parent, AND it's the right class for the launched app, AND
		//it's not already being recorded, then set it as the main fucking window ;). This is easy for now.
	

		for(var style in windowStyles) {
			console.log("%s: %d", style, w.style & windowStyles[style] || w.extStyle & windowStyles[style]);
		}


		var isMain = 
		!w.parent &&
		!this.get("content.mainWindow") &&
		(w.style & windowStyles.WS_MAXIMIZEBOX) && //maximizable
		(w.style & windowStyles.WS_SIZEBOX); //resizable
		//WS_TABSTOP?? - can accept tabs



		// console.log(w.extStyle, windowStyles.WS_EX_TOPMOST, w.extStyle & windowStyles.WS_EX_TOPMOST)


		if(isMain) {
			this.set("content.mainWindow", win);
		} else

		//top most? must be a popup
		if(!(w.extStyle & windowStyles.WS_EX_TOPMOST) && !(w.style & windowStyles.WS_POPUP)) {
			this.get("content.commands").emit("popup", { url: window.location.protocol + "//" + window.location.host + "/live?host=" + this._puppeteer.host + "&token=" + this._puppeteer.token + "&screen=" + w.id, width: w.width, height: w.height });
		} else {
			// console.log("UNABLE TO POPUP");
		}

		this._windows.pushObject(win);
	},

	/**
	 */

	"_onCloseWindow": function(closed) {

		var target = _.find(this._windows.get("content"), function(window) {
			return window.get("id") == closed.id;
		});

		if(!target) return;

		this._windows.removeObject(target);
	},

	/**
	 */

	"_onWindows": function(windows) {
		var self = this;
		for(var i = windows.length; i--;) {
			self._onOpenWindow(windows[i]);
		}
	}
});