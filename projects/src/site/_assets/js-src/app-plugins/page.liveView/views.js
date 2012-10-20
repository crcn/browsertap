var _ = require('underscore'),
mouse = require('./mouse'),
keyboard = require('./keyboard');

module.exports = function(fig) {

	var views = fig.views;


	/**
	 */

	views.LiveIndexView = views.Template.extend({

		/**
		 */

		'tpl': '/views/app/live/index.mu',

		/**
		 */

		'el': '#page-view',


		/**
		 */

		'override ready': function() {
			this._super();

			this._desktop = this.ops.desktop;


			this._hookDesktopEvents();
			this._embedSwf();
		},


		/**
		 */

		'_embedSwf': function() {


			swfobject.embedSWF("/flash/DesktopPlayer.swf", 
				"desktop-player", 
				"100%", 
				"100%", 
				"9.0.0", 
				"/flash/expressInstall.swf", {
					host: 'rtmp://'+this._desktop.rtmpHost+':1935/live'
					// debug: true
				}, {
					bgcolor: "#FF6600"
				});

		},

		/**
		 */

		'_hookDesktopEvents': function() {

			var desktop = this._desktop, prevCoords = {};

			var mouseEvent = function(code, coords, data) {

				if(!coords) {
					coords = prevCoords;
				}

				prevCoords = coords;

				if(desktop) desktop.mouse.event(code, coords.x, coords.y, data);
			}

			var keyboardEvent = function(key, mods, dwFlags) {
				// console.log(key);
				// console.log(mods);
				if(desktop) desktop.keyboard.event(key, mods, dwFlags);
			}

			$(window).mousedown(function(e) {

				if(!$(e.target).closest('#desktop-player').length) return;

				mouseEvent(e.button == 0 ? mouse.events.MOUSEEVENTF_LEFTDOWN : mouse.events.MOUSEEVENTF_RIGHTDOWN);


				if(e.button == 0) return; //only block right click

				e.preventDefault();
				e.stopPropagation();
			});

			$(window).mouseup(function(e) {

				if(!$(e.target).closest('#desktop-player').length) return;

				mouseEvent(e.button == 0 ? mouse.events.MOUSEEVENTF_LEFTUP : mouse.events.MOUSEEVENTF_RIGHTUP);

				if(e.button == 0) return; //only block left click

				// e.preventDefault();
				// e.stopPropagation();
			});

			window.desktopEvents = {
				mouseMove: _.throttle(function(coords) {
					mouseEvent(mouse.events.MOUSEEVENTF_ABSOLUTE | mouse.events.MOUSEEVENTF_MOVE, coords);
				}, 1),
				keyDown: function(data) {
					keyboardEvent(data.keyCode, 0, 0);
				},
				keyUp: function(data) {
					keyboardEvent(data.keyCode, 0, keyboard.events.KEYEVENTF_KEYUP);
				},
				mouseWheel: _.throttle(function(coords) {
					mouseEvent(mouse.events.MOUSEEVENTF_WHEEL, coords, coords.delta);
				}, 50),
				resize: _.debounce(function(data) {
					desktop.screen.resize(data.width, data.height);
				}, 250)
			}
		}


	});



	return views;
}