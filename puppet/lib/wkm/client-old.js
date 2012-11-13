var structr   = require('structr'),
child_process = require('child_process'),
spawn         = child_process.spawn,
exec          = child_process.exec,
path          = require('path'),
_   = require("underscore");


module.exports = structr({

	/**
	 */

	'__construct': function(options) {

		this._video = {
			width: 0,
			height: 0,
			padding: {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			},
			gop_size: 50,
			qmin: 1,
			qmax: 11,
			timeout: 1
		}

		this._rtmpUrl = [options.rtmp.protocol, "//", options.rtmp.hostname, ":", options.rtmp.port, options.rtmp.path].join("");

		if(options.rtmp) {
			this.start();
		}

		this._killing = false;
	},

	/**
	 */

	'restart': function(options) {
		if(this._rtmpUrl) {
			this.start(options);
		}
	},


	/**
	 * starts wkm which broadcasts the given rtmp url
	 */

	'start': function(options) {


		var self = this,
		video = _.extend(this._video, options || {});

		this.kill(function() {


			video.padding = _.defaults(video.padding, { left: 0, right: 0, top: 0, bottom: 0 })
			var args = [
				"-o", self._rtmpUrl, 
				"-w", self._width(), 
				"-h", self._height(), 
				"-pl", video.padding.left,
				"-pr", video.padding.right,
				"-pt", video.padding.top,
				"-pb", video.padding.bottom,
				"-gop_size", video.gop_size || 500,
				"-bit_rate", video.bit_rate || 64,
				"-qmin", video.qmin || 1,
				"-qmax", video.qmax || 11,
				"-timeout", video.timeout || 1];

			console.log("broadcast %s", args.join(" "));

			self._proc = spawn(__dirname + "/bin/cli.exe", args);

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

		self._resizeAllWindows();

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
	 */
	"_width": function() {
		return this._video.width + ((this._video.padding.left || 0) + (this._video.padding.right || 0));
	},

	/**
	 */
	"_height": function() {
		return this._video.height + ((this._video.padding.top || 0) + (this._video.padding.bottom || 0));
	},

	/**
	 * resizes the desktop
	 */

	'resizeDesktop': function(width, height) {

		if(!arguments.length) {
			return this._resizeAllWindows();
		}

		/*width  += (this._video.padding.right + this._video.padding.left);
		height += (this._video.padding.bottom + this._video.padding.top);*/


		this._video.width  = width;
		this._video.height = height;


		console.log('resize: %d, %d', width, height);

		this.start();
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
		this._video.padding = padding;
		if(!this._proc) return;
		this.resizeDesktop();
	},

	/**
	 */

	"_resizeAllWindows": function() {
		var width = this._width(),
		height = this._height();
		var bin = __dirname + "/../../../window_resize/Debug/resize.exe";//'C:\\Program Files\\VMware\\VMware Tools\\VMwareResolutionSet.exe';
		;
		exec(bin+" "+width + ' ' + height, function(err, stdout, stderr) {
			process.stdout.write(stdout);
			process.stderr.write(stderr);
		});
		// this.start(); //restart
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