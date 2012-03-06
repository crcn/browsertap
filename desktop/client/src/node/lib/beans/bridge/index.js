
var thrift = require('thrift'),
Desktop = require('./Desktop'),
ttypes = require('./DesktopController_types');




/*connection.on('error', function(err) {
	console.error(err);
});

client.invokeMouse(new ttypes.MouseCommand({ code: 1, x: 1, y: 1 }), function(err, data) {
	console.log(err)
});

var recordContext = new ttypes.RecordContext();

client.openProgram(new ttypes.OpenAppCommand({ path: 'C:\\Users\\craig\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe', arguments: 'http://facebook.com', ctx: recordContext }), function(err, data) {
	console.log(err)
});*/


exports.plugin = function(router, params) {
	
	console.log('Connecting to desktop host: %s:%s', params.host, params.port);

	//fast: gop_size 250, framerate: 15, don't touch qmin/qmax (10/51)
	var ctx = { frameRate: 24, 
		gopSize: 250, 
		qmin: 10,
		qmax: 50,
		bitRate: 64 }; //94

	var apps = {}, 
	pluginLoader = this, 
	client;


	function connect() {
		
		var connection = thrift.createConnection(params.host, params.port);
		client = thrift.createClient(Desktop, connection);

		connection.on('error', function(err) {
			
		});

		connection.on('close', function(err) {
			
			console.log('Connection closed to desktop controller, reconnecting.');
			setTimeout(connect, 5000);
		})

		connection.on('connect', function() {
			console.log("connected");
			updateCtx();
		})
	}

	function updateCtx(newCtx) {

		if(newCtx)
		for(var i in newCtx) ctx[i] = newCtx[i];
		

		client.updateRecordContext(new ttypes.RecordContext(ctx), function(err, result) {
			
		});
	}


	return {
		
		/**
		 */

		init: function() {
			
			connect();

			pluginLoader.plugins(/app.*/).forEach(function(plugin) {

				apps[plugin.app.processName] = plugin.app;

			});
		},

		/**
		 */

		resize: function(width, height) {

			ctx.width = width;
			ctx.height = height;

			updateCtx();
		},

		/**
		 */

		updateCtx: function(ctx) {
			updateCtx(ctx);
		},

		/**
		 */

		openApp: function(ops) {
			

		 	if(!apps[ops.name]) {
		 		console.error('app %s does not exist. Options are: %s', ops.name, Object.keys(apps).join(', '));
			 	return;
			};

		 	var app = apps[ops.name];

		 	ctx.left   = app.left;
		 	ctx.right  = app.right;
		 	ctx.top    = app.top;
		 	ctx.bottom = app.bottom;


		 	client.openProgram(new ttypes.OpenAppCommand({ name: app.processName.toLowerCase(), path: app.path, arguments: ops.args, ctx: new ttypes.RecordContext(ctx) }), function(err, result) {
		 		
		 	});
		},

		/**
		 */

		 mouseEvent: function(ops) {
		 	
		 	console.log(ops);
		 	client.invokeMouse(new ttypes.MouseCommand(ops), function(err, data) {
				//console.log(err)
			});
		 },

		 /**
		  */

		 keyboardEvent: function(ops) {

		 	console.log(ops);
		 	client.invokeKeyboard(new ttypes.KeyboardCommand(ops), function(err, data) {
				//console.log(err)
			});

		 }
	}
}