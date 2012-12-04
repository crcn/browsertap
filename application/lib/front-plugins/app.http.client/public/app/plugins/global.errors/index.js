var comerr = require("comerr"),
outcome = require("outcome");

exports.require = ["bark","commands"];
exports.name = "global.errors";
exports.plugin = function(bark, commands) {



	var errorHandlers = {
		unknown: function() {
			bark.alert("An unknown error has occured. Please refresh this page.", function() {
				// window.location.refresh();
			});
		}
	}

	errorHandlers[comerr.codes.PaymentRequired] = function(error) {
		/*bark.confirm("You're out of time! Would you like a charge?", function(event) {
			if(event)
		});*/

		bark.alert({ message: "Thanks for trying out Browsertap! Unfortunately you're out of time. If you have a second, please tell us what you think of the application.",
			ok: "Sure"
			// closable: false
			 }, function(event) {
				if(event.ok) {
					window.open("http://google.com", "_blank");
				}


			});
	}

	errorHandlers[comerr.codes.UnableToConnect] = function(err) {
		bark.alert(err.message);
	}


	function onError(error) {

		if(error instanceof Array) {
			for(var i = error.length; i--;) {
				onError(error[i])
			}
			return;
		}

		(errorHandlers[error.code] || errorHandlers.unknown)(error);
	}

	commands.on("error", onError);
	outcome.on("unhandledError", onError);


	return {
		captureRequest: function(cb) {
			return function(result) {
				if(result.errors) {
					return commands.emit("")
				}
			}
		}
	}
}