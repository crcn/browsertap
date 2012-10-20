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
			this.start(options.rtmp.host);
		}
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

		console.log("broadcasting to rtmp server %s", rtmpUrl);
		var self = this;

		this._rtmpUrl = rtmpUrl;

		this.kill();

		this._proc = spawn(__dirname + "/../../../wkm/bin/cli.exe", [rtmpUrl]);

		this._proc.stdout.on('data', function(data) {
			process.stdout.write(String(data));
		});

		this._proc.stderr.on('data', function(data) {
			process.stderr.write(String(data));
		});

		this._proc.on("exit", function() {
			self._proc = null;
		})


		this.padding(this._padding[0], this._padding[1], this._padding[2], this._padding[3]);

		return this;
	},

	/**
	 * kills WKM
	 */

	'kill': function() {
		if(this._proc) {
			this._proc.kill();
			this._proc = undefined;
		}
	},

	/**
	 * resizes the desktop
	 */

	'resizeDesktop': function(width, height) {

		console.log(height)

		width  += (this._padding[1] + this._padding[0]);
		height += (this._padding[3] + this._padding[2]);

		console.log('resize: %d, %d', width, height);

		var bin = __dirname + "/../../../window_resize/Debug/resize.exe";//'C:\\Program Files\\VMware\\VMware Tools\\VMwareResolutionSet.exe';

		exec(bin+" "+width + ' ' + height, function(err, stdout, stderr) {
			process.stdout.write(stdout);
			process.stderr.write(stderr);
		});

		this.restart();

	},

	/**
	 * sends a mouse event
	 */

	'mouseEvent': function(code, x, y, dwData) {
		if(this._proc) this._proc.stdin.write('mouse\n' + this._args(code, x, y, dwData).join(' '));
	},

	/**
	 * sends a keyboard event
	 */

	'keyboardEvent': function(code, bScan, dwFlags) {
		if(this._proc) this._proc.stdin.write('keyboard\n' + this._args(code, bScan, dwFlags).join(' '));
	},

	/**
	 * sets the padding for the 
	 */

	'padding': function(padding) {
		this._padding = this._args(padding.left, padding.right, padding.top, padding.bottom);
		if(this._proc) this._proc.stdin.write('padding\n' + this._padding.join(' '));
		//resize here???
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