require('./history');

var utils = require('./utils'),
_    = require('underscore'),
Url = require('url'),
logger = require('mesh-winston').loggers.get('history.core'),
beanpoll = require('beanpoll'),
qs = require('querystring');


beanpoll.Response.prototype.redirect = function(location) {
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


	var prevPath;


	function pullState(path, data)
	{
		if(path.substr(0,1) != '/') path = '/' + path;

		var parts = Url.parse(path, true);

		if(parts.pathname == prevPath)
		{
			console.log('alreading viewing %s', prevPath);
			return
		}


		prevPath = parts.pathname;

		var hostname  = window.location.hostname,
		hostnameParts = hostname.split('.');
		subdomain     = hostnameParts.length > 2 ? hostnameParts.shift() : undefined,
		query         = _.extend(parts.query, data, true),
		queryStringified = qs.stringify(query) || '';


		logger.info('navigate to ' + parts.pathname);

		router.request(parts.pathname).query(query).headers({ subdomain: subdomain, stream: true, url: parts.pathname + (queryStringified.length ? '?' + queryStringified : '') }).success(function(stream)
		{

			logger.info('dumping stream data');

			var buffer = '', response = {};

			stream.dump({
				error: function(err) {
					console.log(err.stack);
				},
				headers: function(res)
				{
					response = res;

					if(res.redirect)
					{
						router.push('redirect', res.redirect);
					}
				},
				data: function(chunk) {
					buffer += chunk
				},
				end: function() {
					if(response.redirect || response.dontPrint) return;
					
					document.body.innerHTML = buffer;
				}
			})
		}).pull();
	}


	window.onpopstate = function(e)
	{
		logger.verbose('pop state');

		var state = e.state;     

		if(!state) return;

		currentPath = state.path;       

		router.push('track/pageView', { page: state.path });
                                 
		pullState(state.path || state.hash, state.data);
	}  

	/**
	 */

	router.on({

		/**
		 */

		'push redirect': function(ops)
		{        
			var path, data;

			if(typeof ops == 'string')
			{
				path = ops;
				data = {};
				ops = {};
			}
			else
			{
				path = ops.path;
				data = ops.data;
			}

			if(!path) return;

			var urlParts = Url.parse(path, true);   

			logger.info('push recv ' + path);



			var uri = urlParts.pathname,
			newPath = normalizePath(uri);

			data = _.extend(urlParts.query, data);


			if(router.request(uri).type('pull').tag('http', true).hasListeners())
			{	
				if(newPath == currentPath) return;

                                                      
				logger.info('redirect to ' + path);

				window.history.pushState({ data: data, path: path } , null, ('/' + path).replace(/\/+/g,'/'));     

				router.push('track/pageView', { page: path });
			}

			// else
			{

				if(ops.pull === undefined || ops.pull == true)
				//not a viewable item? pull it. might do something else that's fancy...
				pullState(path, data);	
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