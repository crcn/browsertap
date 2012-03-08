window.desktopEvents = {};

var views = require('./views'),
mouse = require('./mouse'),
keyboard = require('./keyboard'),
desktop = require('./desktop');

exports.plugin = function(router) {

	window.controlEvents = {};

	var remote, currentLoc = {};

	router.on({


		/**
		 */

		'push init': function() {
			
			DNode.connect(function(remote) {
    			remote.authorize(null, null, function(mtds) {
					router.push('remote/methods', mtds);
				});
			});

			console.log(DNode.connect.toString())

		},

		/**
		 */

		'pull -public -mixed view -> quality': function(request) {
		
			request.addView(new views.QualityView());
			request.display();
		},


		/**
		 */

		'pull -public -mixed view -> /test': function(request) {
			var browser = request.data.browser,
			url = request.data.url;

			var server = 'rtmp://50.19.224.69:1935/live';
			//server = 'rtmp://localhost:1935/live';

			var virtView = new views.VirtView({ el: '#page-view', browser: browser });
			virtView.addChild(new views.DesktopView({ server: server,  })); 

			request.addView(virtView);

			request.display();

			request.next();

			router.push('remote/test/url', { browser: browser, url: url || 'http://google.com' });

		},

		/**
		 */

		'push change/ctx': function(ctx) {
			remote.bridge.updateCtx(ctx);	
		},

		/**
		 */

		'push remote/test/url': function(ops) {

			if(!ops.url) ops.url = currentLoc.url;

			router.push('redirect', '/test/?browser='+ops.browser+'&url=' + currentLoc.url);

			currentLoc = ops;

		 	if(!remote || !ops.browser) return;

		 	console.log("open app");
		 	console.log(ops);

		 	remote.bridge.openApp({
		 		name: ops.browser,
		 		args: ops.url
		 	});
		},


		/**
		 */

		'push remote/methods': function(rm) {
			mouse.init(rm);
			keyboard.init(rm);
			desktop.init(rm);

			remote = rm;

			if(currentLoc.browser) router.push('remote/test/url', currentLoc);
		}

	});
 
}