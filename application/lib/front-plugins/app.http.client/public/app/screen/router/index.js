var dolce = require("dolce"),
crema     = require("crema"),
traverse  = require("traverse"),
dref      = require("dref"),
_         = require("underscore"),
async     = require("async"),
seq       = require("seq");

exports.name = "router";
exports.plugin = function() {

	var router = {},
	routes = {};

	var collection = dolce.collection();

	function registerRoute(route, target) {


		var cr = _.defaults({
			connectOutlets: function(router, context) {

				var chain = collection.get(route.path).chains[0];

				if(!context) context = {};

				seq(chain).seqEach(function(route) {
					route.value(router, context, this);
				})
			}
		}, target);


		if(route.path) cr.route = route.path.value;
		if(route.path) collection.add(route, target.connectOutlets);

		if(route.type)
		dref.set(routes, route.type, cr);
	}

	router.on = function(route, target) {

		if(arguments.length == 1) {
			for(var r in route) {
				router.on(r, route[r]);
			}
			return;
		}

		if(route.split(" ").length > 1) {
			var routes = crema(route);
		} else {
			var routes = [
				{
					type: route
				}
			]
		}


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