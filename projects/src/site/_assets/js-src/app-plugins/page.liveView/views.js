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

			$('.dropdown-toggle').dropdown();
		}


	});



	return views;
}