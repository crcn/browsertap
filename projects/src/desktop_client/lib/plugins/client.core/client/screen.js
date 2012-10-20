exports.plugin = function(router) {

	return {
		resize: function(width, height) {
			router.desktop.resize(width, height);
		}
	}
}