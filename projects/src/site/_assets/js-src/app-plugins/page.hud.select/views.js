module.exports = function(fig) {

	var views = fig.views;


	/**
	 */

	views.HUDSelectView = views.Template.extend({

		/**
		 */

		'tpl': '#hud-select-template',

		/**
		 */

		'el': '#hud-content-view',


		/**
		 */

		'override ready': function() {
			this._super();

			//$('.dropdown-toggle').dropdown();

			$('.hud-scroll').jScrollPane();
		}


	});



	return views;
}