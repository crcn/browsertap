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


			this._beautifyScrollbars();
		},


		/**
		 */

		'_beautifyScrollbars': function() {

			//scroll-paine that shit.
			$('.hud-scroll').jScrollPane();

			//next, add some animations
			$('.hud-scroll').hover(function() {

				$(this).find('.jspVerticalBar, .jspHorizontalBar').last().fadeIn(50);
			}, 
			function() {

				$(this).find('.jspVerticalBar, .jspHorizontalBar').last().fadeOut(20);

			});
		}


	});



	return views;
}