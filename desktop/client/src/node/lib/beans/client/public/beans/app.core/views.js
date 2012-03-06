var fig = require('fig'),
malt = require('malt'),
views = fig.views,
models = malt.models;
                                         

/**
 * the home page
 */

views.IndexView = views.Template.extend({
	   
	tpl: '/index.html'
});     


module.exports = views;