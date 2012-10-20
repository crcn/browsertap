var structr   = require('structr'),
child_process = require('child_process'),
spawn         = child_process.spawn,
tq            = require('tq'),
exec          = child_process.exec,
path          = require('path')


module.exports = structr({

	/**
	 */

	'__construct': function() {
		this._padding = [0, 0, 0, 0];
	},

	/**
	 */

	'restart': function() {

		if(this._rtmpUrl) this.start(this._rtmpUrl);

	},

	/**
	 */

	'start': function(rtmpUrl) {

		this._rtmpUrl = rtmpUrl;

		this.kill();

		this._proc = spawn(__dirname + "/../../../desktop_controller/bin/cli.exe", [rtmpUrl]);

		this._proc.stdout.on('data', function(data) {
			process.stdout.write(String(data));
		});

		this._proc.stderr.on('data', function(data) {
			process.stderr.write(String(data));
		});


		this.padding(this._padding[0], this._padding[1], this._padding[2], this._padding[3]);

		return this;
	},

	/**
	 */

	'kill': function() {

		if(this._proc) {
			this._proc.kill();
			this._proc = undefined;
		}
	},

	/**
	 */

	'resize': function(width, height) {

		console.log(height)

		width += (this._padding[1] + this._padding[0]);
		height += (this._padding[3] + this._padding[2]);

		console.log('resize: %d, %d', width, height);

		var bin = 'C:\\Program Files\\VMware\\VMware Tools\\VMwareResolutionSet.exe';

		exec(bin.replace(/\\([^\\]+)/g,'\\"$1"') + ' 0 1 , 0 0 ' + width + ' ' + height, function(err, stdout, stderr) {
			process.stdout.write(stdout);
			process.stderr.write(stderr);
		});

		this.restart();

	},


	/**
	 */

	'mouseEvent': function(code, x, y, dwData) {

		if(this._proc) this._proc.stdin.write('mouse\n' + this._args(code, x, y, dwData).join(' '));
	},

	/**
	 */

	'keyboardEvent': function(code, bScan, dwFlags) {
		if(this._proc) this._proc.stdin.write('keyboard\n' + this._args(code, bScan, dwFlags).join(' '));
	},

	/**
	 */

	'padding': function(left, right, top, bottom) {
		if(this._proc) this._proc.stdin.write('padding\n' + (this._padding = this._args(left, right, top, bottom)).join(' '));
	},


	/**
	 */

	'_args': function() {

		var args = [];

		for(var i = arguments.length; i--;) {
			args[i] = arguments[i] || 0;
		}

		return args;
	}


})