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
					host: 'http://localhost:1935/live',
					debug: true
				}, {
					bgcolor: "#FFFFFF"
				});

		}


	});



	return views;
}