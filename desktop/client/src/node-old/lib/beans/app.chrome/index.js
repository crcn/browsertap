exports.plugin = function(router) {
	

	return {
		app: {
				name: 'Chrome',
				processName: 'chrome',
				//path: 'C:\\Users\\craig\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
				path: 'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe',
				/*left: 9,
				right: 9,
				top: 80,
				bottom: 8*/
				left: 0, right: 0, top: 0, bottom: 0
			}
	}
}