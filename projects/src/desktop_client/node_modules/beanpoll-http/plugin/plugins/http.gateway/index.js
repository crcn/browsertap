var logger = require('winston').loggers.get('bean.http'),
sprintf    = require('sprintf').sprintf,
mime       = require('mime'),
_          = require('underscore'),
beanpollMiddleware = require('./middleware/beanpoll'),
connect    = require('connect'),
tq = require('tq')

require('./monkeypatch/response');


exports.plugin = function(router) {



	var use = [], 
    server, 
    publicDir   = this.params('publicDir');


	
    router.on({

    	/**
    	 */

        'push init': function()
        {
			router.on({
				
		        /**
		         * middleware for the requests
		         */

		        'push -collect http/request/middleware OR connect/middleware': function(middleware)
		        {
		        	use.push(middleware);
		        }
			});
	    },    
        

        /**
         */
         
        'push http/server': function(srv)
        {
        	server = srv;

        	logger.info('http.gateway received server');

            if(publicDir) 
            	server.use(connect.static(publicDir));

            server.use(function(req, res, next) {
            	
            	var q = tq.queue();

            	use.forEach(function(mw) {
            		
            		q.push(function() {

            			mw(req, res, this);

            		});
            	});

            	q.push(next);

            	q.start();
            });
            	
            server.use(beanpollMiddleware(router));
        }
    });
}