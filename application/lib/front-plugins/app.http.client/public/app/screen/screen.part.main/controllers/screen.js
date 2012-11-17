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
		var self  = this,
		puppeteer = this._puppeteer = this.get("content.puppeteer");

		puppeteer.connect(function() {
			self._onConnection(puppeteer.connection);
		});

	},

	/**
	 */

	"_onConnection": function(connection) {
		this._connection = connection;

		var self = this;

		connection.client.windows.getWindow(this.get("content.screen"), function(err, window) {
			if(err) return window.close();
			self._onOpenWindow(window);
		});



	},

	/**
	 */

	"_onOpenWindow": function(win) {
		this._connection.bindWindow(win.id)
		this.set("content.mainWindow", Ember.Object.create(win));

		var self = this;
		function checkExists() {
			self._connection.client.windows.hasWindow(win.id, function(err, exists) {
				if(!exists) return window.close();
			});

			self._connection.events.on("closeWindow", function(closed) {
				if(closed.id == win.id) window.close();
			});
		}



		checkExists();
	},

	/**
	 */

	"_onCloseWindow": function(closed) {
		//TODO 
	}
});