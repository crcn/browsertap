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

		/**
		 */

		'tpl': '#browser-cell-template',

		/**
		 */

		'override render': function() {
			this._super();
		},

		/**
		 */

		'override ready': function() {
			this._super();

			$(this.el).click(this.getMethod('select'))
		},

		/**
		 */

		'select': function() {
			$(this.el).trigger('selected');
			$(this.el).addClass('selected-browser');

			var row = $(this.el).closest('.hud-scroll'),
			cols = row.parent().closest('.hud-scroll'),
			ax = row.jScrollPane().data('jsp'),
			ay = cols.jScrollPane().data('jsp');

			ax.scrollToElement(this.el);
			ay.scrollToElement(row);
		},

		/**
		 */

		'deselect': function() {
			$(this.el).trigger('deselected');
			$(this.el).removeClass('selected-browser');
		},

		/**
		 */

		'templateData': function() {
			return {
				browserVersion: this.ops.browserVersion
			}
		}
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

			var numBrowsers = 0, div = 0;

			this._cellCols = [];
			this._cx = 0;
			this._cy = 0;
			this._px = 0;
			this._py = 0;


			for(var browserName in browsers) {

				numBrowsers++;

				var row = $('<div class="hud_select_row"><div class="hud-scroll"></div></div>'),
				cellContainer = row.find('.hud-scroll');
				$(this.el).append(row);

				var browserVersions = browsers[browserName];

				row.prepend('<div class="hud_select_logo" style="background-image:url(\'/img/browsers/256-'+browserName+'.png\');"></div>');

				var cellRow = [];

				for(var i = 0, n = browserVersions.length; i < n; i++) {

					div++;

					cellContainer.append('<div class="hud_select_cell" id="browserCell'+div+'"></div>');

					var cell = new views.HUDCellView({ el: '#browserCell' + div, browserVersion: browserVersions[i], browserName: browserName });


					cellRow.push(this.addChild(cell));
					this._bindBrowserCell(cell);
				}

				this._cellCols.push(cellRow);

			}


			this._listenForKeyboard();


		},

		/**
		 */

		'_listenForKeyboard': function() {

			var self = this;

			$(this.el).keydown(function(event) {
				event.preventDefault();
				switch(event.which) {
					case 37: return self._left();
					case 38: return self._up();
					case 39: return self._right();
					case 40: return self._down();
					case 13: return self._enter();
					case 32: return self._space();
				}
			})
		},


		/**
		 */

		'_up': function() {
			this._moveY(-1);
		},

		/**
		 */

		'_down': function() {
			this._moveY(1);
		},

		/**
		 */

		'_left': function() {
			this._moveX(-1);
		},

		/**
		 */

		'_right': function() {
			this._moveX(1);
		},

		/**
		 */

		'_enter': function() {

		},

		/**
		 */

		'_space': function() {

		},

		/**
		 */

		'_bindBrowserCell': function(cell) {
			var self = this;
			$(cell.el).bind('selected', function() {
				if(self._currentCell) self._currentCell.deselect();


				for(var i = self._cellCols.length; i--;) {
					var row = self._cellCols[i], found = false;
					for(var j = row.length; j--;) {
						if(row[j] == cell) {

							self._cx = j;
							self._cy = i;
							found = true;
							self._currentCell = cell;
							self._crow = row;

							break;
						}
					}

					if(found) break;
				}
			})
		},


		/**
		 */

		'_moveX': function(pos) {
			this._crow[this._index(this._cx + pos, this._crow)].select();
		},

		/**
		 */

		'_moveY': function(pos) {

			var i = this._cellCols.indexOf(this._crow);

			var nrow = this._cellCols[this._index(i + pos, this._cellCols)];

			this._findClosestElement(nrow, this._currentCell).select();
		},


		/**
		 */

		'_index': function(pos, array) {
			return Math.max(0, Math.min(pos, array.length - 1 ));
		},


		/**
		 */

		'_findClosestElement': function(row, cell) {

			var cx = 0,
			closest,
			cmpx = this._relPos(cell);

			for(var i = row.length; i--;) {
				var rc = row[i],
				var relPos = this._relPos(rc);

				if(relPos < 0) continue;

				var nx = Math.abs(relPos - cmpx);

				if(!closest || (nx < cx)) {
					cx = nx;
					closest = rc;
				}
			}

			return closest;
		},

		/**
		 */

		 '_relPos': function(cell) {
		 	var cmp = $(cell.el),
			holder = cmp.closest('.hud-scroll').data('jsp'),
			return cmp.position().left - holder.getContentPositionX();
		 }


	});



	return views;
}