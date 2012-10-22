var structr   = require('structr'),
child_process = require('child_process'),
spawn         = child_process.spawn,
exec          = child_process.exec,
path          = require('path')


module.exports = structr({

	/**
	 */

	'__construct': function(options) {
		this._padding = [0, 0, 0, 0]; 
		if(options.rtmp) {
			this.start([options.rtmp.protocol, "//", options.rtmp.hostname, ":", options.rtmp.port, options.rtmp.path].join(""));
		}
		this._width = this._height = 0;
		this._killing = false;
	},

	/**
	 */

	'restart': function() {
		if(this._rtmpUrl) this.start(this._rtmpUrl);
	},

	/**
	 * starts wkm which broadcasts the given rtmp url
	 */

	'start': function(rtmpUrl) {

		var self = this;
		// rtmpUrl = "C:\\Users\\Administrator\\Desktop\\test.flv"

		if(arguments.length) this._rtmpUrl = rtmpUrl || this._rtmpUrl;



		this.kill(function() {
			console.log("broadcasting to rtmp server %s", self._rtmpUrl);
			self._proc = spawn(__dirname + "/../../../wkm/bin/cli.exe", [self._rtmpUrl, 
				self._width, 
				self._height, 
				self._padding[0], 
				self._padding[1],
				self._padding[2],
				self._padding[3]]);

			self._proc.stdout.on('data', function(data) {
				process.stdout.write(String(data));
			});

			self._proc.stderr.on('data', function(data) {
				process.stderr.write(String(data));
			});

			self._proc.on("exit", function() {
				self._proc = null;
				console.log("EXIT")
			});
		});

		


		//this.padding(this._padding[0], this._padding[1], this._padding[2], this._padding[3]);
		//this._resize(this._width, this._height);

		return this;
	},

	/**
	 * kills WKM
	 */

	'kill': function(callback) {
		var self = this;
		if(this._killing) return;
		this._killing = true;
		if(!callback) callback = function(){};
		if(this._proc) {
			console.log("KILL")
			this._proc.once("exit", function() {
				self._killing = false;
				callback();
			});
			this._proc.kill();
			this._proc = undefined;
		} else {
			callback();
		}
	},

	/**
	 * resizes the desktop
	 */

	'resizeDesktop': function(width, height) {

		if(!arguments.length) {
			return this._resizeAllWindows();
		}

		if(!width) width = this._width;
		if(!height) height = this._height;



		width  += (this._padding[1] + this._padding[0]);
		height += (this._padding[3] + this._padding[2]);


		this._width  = width;
		this._height = height;


		console.log('resize: %d, %d', width, height);

		this._resizeAllWindows();
	},

	/**
	 * sends a mouse event
	 */

	'mouseEvent': function(code, x, y, dwData) {
		if(this._proc) this._proc.stdin.write('mouse\n' + this._args(code, x, y, dwData).join(' ') + "\n");
	},

	/**
	 * sends a keyboard event
	 */

	'keyboardEvent': function(code, bScan, dwFlags) {
		if(this._proc) this._proc.stdin.write('keyboard\n' + this._args(code, bScan, dwFlags).join(' ') + "\n");
	},

	/**
	 * sets the padding for the 
	 */

	'padding': function(padding) {
		this._padding = this._args(padding.left, padding.right, padding.top, padding.bottom);
		if(!this._proc) return;
		 // this._proc.stdin.write('padding\n' + this._padding.join(' ') + "\n");
		//resize here???
		this.resizeDesktop();
	},


	/**
	 */

	"_resizeAllWindows": function() {
		var width = this._width,
		height = this._height;
		var bin = __dirname + "/../../../window_resize/Debug/resize.exe";//'C:\\Program Files\\VMware\\VMware Tools\\VMwareResolutionSet.exe';

		exec(bin+" "+width + ' ' + height, function(err, stdout, stderr) {
			process.stdout.write(stdout);
			process.stderr.write(stderr);
		});
		this.start(); //restart
	},

	/**
	 * fills args with 0s
	 */

	'_args': function() {

		var args = [];

		for(var i = arguments.length; i--;) {
			args[i] = arguments[i] || 0;
		}

		return args;
	}


})