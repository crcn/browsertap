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

		'el': '#hud_content_view',


		/**
		 */

		'override ready': function() {
			this._super();

		}


	});



	return views;
}