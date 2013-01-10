var beanpoll = require("beanpoll"),
sprintf = require("sprintf").sprintf,
Url = require("url"),
path = require("path"),
qs = require("querystring");

exports.name = "router";
exports.plugin = function() {
	var currentPath,
	pushedReady = false;

	var router = beanpoll.router(),
	fullQuery = {};



	function normalizePath(path)
	{
		return router.parse.stringifySegments(router.parse.parsePath(path).segments)
	}



	function pullState(parts)
	{
		var hostname  = window.location.hostname,
		hostnameParts = hostname.split('.');
		subdomain     = hostnameParts.length > 2 ? hostnameParts.shift() : undefined;

		console.log('navigate to ' + parts.pathname);

		router.request(parts.pathname).
		query(parts.query).
		headers({ subdomain: subdomain, stream: true, url: parts.href }).
		success(function(stream)
		{
		}).pull();
	}


	/**
	 */

	window.onpopstate = function(e)
	{
		console.log('pop state');

		var state = e.state;     


		if(!state || !setLocation(state)) {
			return;
		}

		router.push('track/pageView', { page: state.href });
                                 
		pullState(state);
	} 

	var prevLocation;

	/**
	 */

	function parseLocation(location, data) {

		if(typeof location == 'object') return location;

		var newLocation      = Url.parse(path.normalize("/"+location), true);


		if(data) {
			_.extend(newLocation.query, data);
		}


		return newLocation;
	}

	/**
	 */

	function canSetLocation(location, data) {

		var newLocation  = parseLocation(location, data);

		if(!prevLocation || prevLocation.pathname != newLocation.pathname) return true;

		var compare = _.uniq(Object.keys(prevLocation.query).concat(Object.keys(newLocation.query)));

		for(var i = compare.length; i--;) {

			var key = compare[i];

			if(prevLocation.query[key] != newLocation.query[key]) return true;

		}

		return false;

	}


	/**
	 */

	function setLocation(location, data) {

		var newLocation = parseLocation(location, data);

		if(canSetLocation(newLocation)) {
			return !!(prevLocation = newLocation);
		}


		console.log(sprintf('already viewing %s', newLocation.href));

		return false;
	} 

	router.redirect = function(pathname, query, pull) {
		var newUrl, query;


		//there's a bug within qs.stringify which turns numbers into boolean values. To fix that, we
		//change all values into strings.
		for(var key in query) {
			query[key] = String(query[key]);
		}


		var urlParts = parseLocation(pathname, query);  

		fullQuery = _.defaults(urlParts.query, fullQuery);

		console.log('push recv ' + newUrl);

		if(router.request(urlParts.pathname).type('pull').tag('http', true).hasListeners())
		{	

			if(!setLocation(urlParts)) {
				return;
			}


			var stringified = qs.stringify(urlParts.query || {});
			// alert(stringified.length)

			var href = urlParts.pathname + (stringified.length ? '?' + stringified : '');
                                                  
			console.log(sprintf('redirect to %s', href));

			window.history.pushState(urlParts, null, href);     

			router.push('track/pageView', { page: href });

		} else {

			console.log('page does not exist, redirecting to home page');

			// router.push('redirect', '/');
			// window.location = '/';
			return false;
		}


		if(pull !== false) {
			//not a viewable item? pull it. might do something else that's fancy...
			pullState(urlParts);	
		} else {
			console.warn('Unable to do anything with push state');
		}

	}

	setTimeout(function() {
		var hasListeners = router.request(window.location.pathname).type('pull').hasListeners();
		if(hasListeners) router.redirect(window.location.pathname + window.location.search);
	}, 1)

	/**
	 */

	router.on({


		/**
		 */

		/*'push -one init': function() {
			console.log('app ready');


			var hasListeners = router.request(window.location.pathname).tag('static', false).type('pull').hasListeners();


			router.push('redirect', window.location.pathname + window.location.search);
			router.push('history/ready');   


			router.on({
				'pull history/ready': function(req, res) {
					res.end(true);
				}
			});
		}*/
	});

	return router;
}