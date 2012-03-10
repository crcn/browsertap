
module.exports = function() {

	var currentWindow = null;

	return function(remote, con) {

		remote.on("mousemove", function() {

			if(currentWindow && currentWindow !== remote) {
				currentWindow.isFocus = false;
			}

			if(!remote.isFocus) {
				remote.emit("focus");
			}

			remote.isFocus = true;
			currentWindow = remote;
		})
	}
}