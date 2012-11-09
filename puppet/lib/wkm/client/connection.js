var spawn = require("child_process").spawn,
structr = require("structr"),
EventEmitter = require("events").EventEmitter,
path = require("path")

module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function() {
		this._callerId = 1;
	},

	/**
	 */

	"open": function() {

		this._proc = spawn(path.normalize(__dirname + "\\..\\..\\..\\..\\wkm\\bin\\cli.exe"), []);
		var self = this;

		this._proc.stdout.on('data', function(data) {

			var line = String(data),
			commands = line.split(">>>>>").filter(function(item) {
				return item.length > 0;
			});

			var cmd;
			for(var i = commands.length; i--;) {
				var cmdstr = commands[i], cmd;
				try {
					cmd = JSON.parse(cmdstr);
					if(cmd.replyTo) {
						self.emit("replyTo-" + cmd.replyTo, cmd.error, cmd.data);
					} else {
						self.emit(cmd.name, cmd.data);
					}

				} catch(e) {
					process.stderr.write("Unable to parse " + cmdstr);
					console.error(e.stack)
				}
			}
		});

		this._proc.stderr.on('data', function(data) {
			process.stderr.write(String(data));
		});

		this._proc.on("exit", function() {
			this._proc = null;
		});
	},

	/**
	 */

	"execute": function(name, data, callback) {

		if(typeof data == "function") {
			callback = data;
			data = {};
		}

		var callerId = this._callerId++, self = this;

		if(callback) {
			this.once("replyTo-" + callerId, callback);
		}

		self._proc.stdin.write(JSON.stringify({ name: name, id: callerId, data: data }) + "\r\n");
	}
});