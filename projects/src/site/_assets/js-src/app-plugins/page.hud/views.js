module.exports = function(fig) {

	var views = fig.views;


	/**
	 */

	views.HUDView = views.Template.extend({

		/**
		 */

		'tpl': '/views/app/hud/index.mu',

		/**
		 */

		'el': '#page-view',


		/**
		 */

		'override ready': function() {
			this._super();

			$('.hud-scroll').jScrollPane();
			//$('.dropdown-toggle').dropdown();
		}


	});



	return views;
}