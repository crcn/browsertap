var browserDetect = require('./browserDetect');

module.exports = function() {

	var currentWindow = null;

	return function(remote, con) {


		remote.browser = getBrowserInfo(remote);

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


var browserMap = ['msie','chrome','safari','iphone','ipad','android','opera','gecko','firefox','seamonkey'];



function getBrowserInfo(con)
{
	return browserDetect(con.navigator);
}


function getBrowserName(navigator) {

	var ua = [];

	for(var i = browserMap.length; i--;) {
		var browser = browserMap[i];
		if(navigator.userAgent.toLowerCase().indexOf(browser) > -1) {
			ua.push(browser);
		}
	}

	return ua;
}