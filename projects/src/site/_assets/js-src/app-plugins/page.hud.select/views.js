module.exports = function(fig) {


	var browsers = {
		'ie': [10, 9, 8, 7, 6],
		'chrome': ['nightly', 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
		'firefox': ['nightly', 10, 9, 8, 7, 6, 5, 4, 3.6, 3.5, 3.0],
		'safari': [5.1, 5.0, 4.0],
		'opera': [11.6, 11.5, 11.0, 10.5, 10.0]
	}

	var views = fig.views;

	views.HUDCellView = views.Template.extend({

	});



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

			var numBrowsers = 0;


			for(var browserName in browsers) {

				numBrowsers++;

				var row = $('<div class="hud_select_row"><div class="hud-scroll"></div></div>'),
				cellContainer = row.find('.hud-scroll');

				var browserVersions = browsers[browserName];

				row.prepend('<div class="hud_select_logo" style="background-image:url(\'/img/browsers/256-'+browserName+'.png\');"></div>');

				for(var i = 0, n = browserVersions.length; i < n; i++) {

					cellContainer.append('<div class="hud_select_cell"><h2>'+browserVersions[i]+'</h2></div>');
				}

				$(this.el).append(row);
			}


		}


	});



	return views;
}