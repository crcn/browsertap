var Url        = require('url'),
sprintf    = require('sprintf').sprintf,
mime       = require('mime'),
_          = require('underscore'),
vine = require('vine'),
logger = require('winston').loggers.get('bean.http'),
sprintf = require('sprintf').sprintf;

module.exports = function(router) {
	
	function _401(res)
	{
		res.writeHead(401, {'Content-Type': 'text/plain'});
		res.end("Unauthorized");
	}

	function _500(res, err)
	{
		logger.error(err);

		res.writeHead(500, {'Content-Type': 'text/plain'});
		res.end(err.stack || err);
	}

	return function(req, res, next) {
	
		var urlParts = Url.parse(req.url, true),
		pathParts    = urlParts.pathname.match(/(.*?)(?:\.(\w+))?$/),
		channel      = pathParts[1],
		fileType     = pathParts[2],
		query        = urlParts.query,

		//mime needed for the response
		mimeType     = mime.lookup(fileType || '', 'text/plain');


		//DEPRECATED! - this should be in the body of some post. CHECK HEADERS
		if(query.json) {
			
			try {

				_.extend(query, JSON.parse(query.json));

			} catch(e) {

				logger.error(e);

			}
		}
		headers = {};


		_.extend(query, query.query);
		_.extend(headers, req.headers, query.headers);

		var method  = headers.method || query.httpMethod || req.method;


		headers.fileType = fileType;
		headers.stream = true;

		logger.debug(sprintf('http %s %s', method, channel));


		var request = router.request(channel).
		tag('method', method).
		query(query).
		headers(headers).
		type('pull');

		if(!request.exists()) request.tag('method', true);

		//no listeners? let connect handle it. 
		if(!request.exists()) {
			logger.debug('404')
			return next();
		}


		request.

		//prepares the request
		pre(function(req, res, mw) {
			mw.next(); //for now...
		}).

		//error on request
		error(function(err) {
			_500(res, err);
		}).

		//on successful stream
		success(function(stream) {

			var rheaders = {};

			var rheaders = { };

			//this chunk is used to allow ajax applications to load data from the server
			rheaders['Access-Control-Allow-Origin'] =  req.headers.origin || '*';

			//is ajax
			if(req.headers['access-control-request-headers'])
			{                            
				//i believe the timestamp is used so the access control is cached client side, omitting the need
				//to hit the server on every request
				rheaders['Date'] = (new Date()).toGMTString();

				//allow the headers that were sent
				rheaders['Access-Control-Allow-Headers'] =  req.headers['access-control-request-headers'];

				//allow only the most common methods
				rheaders['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';

				//allow session data to be passed to the server from ajax. this should really be oauth since this is NOT supported
				//in older browsers
				//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				//from W3C: The string "*" cannot be used for a resource that supports credentials.
				//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				// r.headers['Access-Control-Allow-Credentials'] = 'true';

				//tell the client to store the access control for 17000 seconds
				rheaders['Access-Control-Max-Age'] = 17000; 

				//cache for the time to live, OR 30 days
				// headers['Expires'] = new Date(new Date().getTime() + (route.ttl.client || 3600*24*30)*1000).toGMTString();     
			}


			stream.dump({
				
				headers: function(response) {
					
						if(response.session) {

							rheaders['Set-Cookie'] = response.session.http;

						}

						//redirect to a different location
						if(response.redirect) {

							response.statusCode = 301;
							rheaders['Location'] = response.redirect.indexOf('://') > -1 ? response.redirect : 'http://' + (req.headers.host+'/'+response.redirect).replace(/\/+/g,'\/');

						}

						if(response.authorization) {

							rheaders['WWW-Authenticate'] = response.authorization.http;
							response.statusCode = 401;

						}


						if(response.mime) {

							mimeType = response.mime;

						}

						if(response.purge) {
							if(response.purge.regex) rheaders['X-Purge-Regex'] = response.purge.regex.toString();
							if(response.purge.path) rheaders['X-Purge-URL'] = response.purge.path;
						}


						//rheaders['Expires']		 = '17-Jan-2038 19:14:07 GMT';
						rheaders['Connection'] 	 = 'keep-alive';
						rheaders['Content-Type']  = urlParts.query.callback ? 'application/x-javascript' : mimeType;
						rheaders['Cache-Control'] = 'max-age='+(response.ttl || 0)+', public';
						//rheaders['Transfer-Encoding'] = 'Chunked';
						
						res.writeHead(response.statusCode || 200, rheaders);
				},


				error: function(err) {

					if(mimeType == 'application/json') {
						err = JSON.stringify(vine.error(err.stack).data);
						
					}

					_500(res, err);

				},

				data: function(data, encoding) {
					
					var chunk = data;



					if(!(data instanceof Buffer)) {
						if(data instanceof Object) {

							chunk = query.pretty != undefined ? JSON.stringify(data, null, 2) : JSON.stringify(data);

							if(data.errors) {

								data.errors.forEach(function(error) {

									console.log('Error Response: ' + error.message);
								});
							}
						}



						//callback provided? wrap the response up
						if(urlParts.query.callback) chunk = urlParts.query.callback +' (' + chunk + ');';
					}
					

					//send the chunk
					res.write(chunk, encoding);
				},

				end: function(data) {
					
					res.end();
				}
			});

		}).
		pull();
	}
}