require('./history');

var utils = require('./utils'),
_    = require('underscore'),
Url = require('url'),
logger = require('mesh-winston').loggers.get('history.core'),
beanpoll = require('beanpoll'),
qs = require('querystring'),
sprintf = require('sprintf').sprintf,
path = require('path');


beanpoll.Response.prototype.redirect = function(location) {
	console.log("REDIR")
	this.headers({ redirect: location });
	
	this.end();
}

exports.plugin = function(router)
{
	var currentPath,
	pushedReady = false;




	function normalizePath(path)
	{
		return router.parse.stringifySegments(router.parse.parsePath(path).segments)
	}



	function pullState(parts)
	{
		var hostname  = window.location.hostname,
		hostnameParts = hostname.split('.');
		subdomain     = hostnameParts.length > 2 ? hostnameParts.shift() : undefined;


		logger.info('navigate to ' + parts.pathname);

		router.request(parts.pathname).
		query(parts.query).
		headers({ subdomain: subdomain, stream: true, url: parts.href }).
		success(function(stream)
		{

			logger.info('dumping stream data');

			var buffer = '', response = {};

			stream.dump({
				error: function(err) {
					console.log(err);
				},
				headers: function(res)
				{
					response = res;

					if(res.redirect)
					{
						logger.verbose('redirect')
						router.push('redirect', res.redirect);
					}
				},
				data: function(chunk) {
					buffer += chunk
				},
				end: function() {
					logger.verbose("http ended")
					if(response.redirect || response.dontPrint) return;
					
					document.body.innerHTML = buffer;
				}
			})
		}).pull();
	}


	/**
	 */

	window.onpopstate = function(e)
	{
		logger.verbose('pop state');

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



		logger.info(sprintf('already viewing %s', newLocation.href));

		return false;
	} 

	/**
	 */

	router.on({

		/**
		 */

		'push redirect': function(ops)
		{        
			var newUrl, query;


			if(typeof ops == 'string')
			{
				newUrl = ops;
				data = {};
				ops = {};
			}
			else
			{
				newUrl = ops.path;

				//data is deprecated
				query   = ops.data || ops.query;
			}

			if(!newUrl) return;


			var urlParts = parseLocation(newUrl, query);  

			logger.info('push recv ' + newUrl);

			if(router.request(urlParts.pathname).type('pull').tag('http', true).hasListeners())
			{	

				if(!setLocation(urlParts)) {
					return;
				}


				var stringified = qs.stringify(urlParts.query || {});

				var href = urlParts.pathname + stringified.length ? '?' + stringified : '';
                                                      
				logger.info(sprintf('redirect to %s', href));

				window.history.pushState(urlParts, null, href);     

				router.push('track/pageView', { page: href });

			} else {

				logger.info('page does not exist, redirecting to home page');

				// router.push('redirect', '/');
				window.location = '/';
				return false;
			}


			if(ops.pull === undefined || ops.pull == true) {
				//not a viewable item? pull it. might do something else that's fancy...
				pullState(urlParts);	
			} else {
				logger.warn('Unable to do anything with push state');
			}


		},

		/**
		 */

		'pull load/*': function(req, res, mw) {
			$(document).ready(function() {
				mw.next();
			});
		},

		/**
		 */

		'push -one init': function() {
			logger.info('app ready');


			var hasListeners = router.request(window.location.pathname).tag('static', false).type('pull').hasListeners();


			router.push('redirect', window.location.pathname + window.location.search);
			router.push('history/ready');   


			router.on({
				'pull history/ready': function(req, res) {
					res.end(true);
				}
			})
		}
	})
}