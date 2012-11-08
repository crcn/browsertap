var structr = require("structr"),
spawn       = require("child_process").spawn;

module.exports = structr({

	/**
	 */


	"__construct": function(options) {
		this._options = options;
		this.open();
	},

	/**
	 */

	"open": function() {
		this._proc = spawn(__dirname + "/../../../wkm_v1.5/bin/cli.exe", []);

		this._proc.stdout.on('data', function(data) {
			process.stdout.write(String(data));
		});

		this._proc.stderr.on('data', function(data) {
			process.stderr.write(String(data));
		});

		this._proc.on("exit", function() {
			self._proc = null;
			console.log("EXIT")
		});
	},

	/**
	 */

	"getAllWindows": function() {

	}
});