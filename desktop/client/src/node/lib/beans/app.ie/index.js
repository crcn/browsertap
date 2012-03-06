exports.plugin = function(router) {
	

	return {
		app: {
				name: 'Internet Explorer',
				processName: 'iexplore',
				path: 'C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe',
				/*left: 10,
				right: 10,
				top: 128,
				bottom: 10*/
				left: 0, right: 0, top: 0, bottom: 0
			}
	}
}