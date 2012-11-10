var step = require("step"),
_ = require("underscore");

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
		puppeteer = this.get("content.puppeteer");


		puppeteer.connect(function() {
			self._onConnection(puppeteer.connection);
		});

		var self = this;
	},

	/**
	 */

	"_onConnection": function(connection) {
		this._connection = connection;

		var self = this,
		app       = this.get("content.app"),
		open      = this.get("content.open");


		connection.events.on("openWindow", function(window) {
			self._onOpenWindow(window);
		});


		connection.events.on("closeWindow", function(window) {
			self._onCloseWindow(window);
		});

		connection.client.windows.getWindows(function(err, windows) {
			self._onWindows(windows);
		})


		/*connection.browsers.open(open, app, function() {
		});*/
	},

	/**
	 */

	"_onOpenWindow": function(window) {
		this.set("content.loading", false);	
		this._windows.pushObject(Ember.Object.create(window));
	},

	/**
	 */

	"_onCloseWindow": function(closed) {

		var target = _.find(this._windows.get("content"), function(window) {
			return window.get("id") == closed.id;
		});

		console.log(target)

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