module.exports = function(fig) {
		
	var views = fig.views;


	views.IndexView = views.Template.extend({
		
		tpl: '/index.html',

		'override render': function() {
			this._super();
		}
	});
	

	views.HelloView = views.View.extend({
		
		'el': '#page',

		'override render': function() {
			this._super();
			this.$$(this.el).html('html!');
		}
	});

	return views;
}