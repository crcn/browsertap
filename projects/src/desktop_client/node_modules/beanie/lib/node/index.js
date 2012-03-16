var beanpoll = require('beanpoll'),
    plugin     = require('plugin');



function _plugin(router) {
	
	router.on({

		//nothing to override? return
		'pull load': function(req, res) {
			res.end();
		}
	});
}


exports.loader = function() {

	var loader = plugin.loader(),
	router     = beanpoll.router();

	loader.router = router;

	_plugin(router);
	
	//once ALL the plugins are loaded in, call load on each route
	loader.once('loaded', function() {
		router.request('load').success(function() {
			router.push('init');
		}).
		error(function(err) {
			console.error(err.stack);
		}).pull();
	});

	return loader.options(router);
}