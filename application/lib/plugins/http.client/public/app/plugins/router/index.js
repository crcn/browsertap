var dolce = require("dolce"),
crema     = require("crema"),
traverse  = require("traverse"),
dref      = require("dref");

exports.name = "router";
exports.plugin = function() {

	var router = {},
	routes = {};

	var collection = dolce.collection();

	function registerRoute(route, target) {
		var cr = target;//,
		// connectOutlets = typeof target == "function" ? target : target.connectOutlets;

		cr.route = route.path.value;
		// cr.connectOutlets = connectOutlets;

		dref.set(routes, route.tags.name, cr);
	}

	router.on = function(route, target) {

		if(arguments.length == 1) {
			for(var r in route) {
				router.on(r, route[r]);
			}
			return;
		}

		var routes = crema(route);

		for(var i = routes.length; i--;) {
			registerRoute(routes[i], target);
		}
	}


	function wrapRoutes(routes) {

		var nr = {};

		for(var key in routes) {
			var prop = routes[key], top = typeof prop;
			
			if(top != "function" && !/connectOutlets|route/.test(key)) {
				nr[key] = wrapRoutes(prop);
			} else {
				nr[key] = prop;
			}
		}

		return Ember.Route.extend(nr);
	}

	router.initialize = function() {
		return Ember.Router.extend({
			root: wrapRoutes(routes)
		})
	}

	return router;
}