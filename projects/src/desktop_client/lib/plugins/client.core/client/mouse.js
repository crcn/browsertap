exports.plugin = function(router) {

	return {
		event: function(code, x, y, dwFlags) {
			console.log('mouse event: %d, %d, %d, %d', code, x, y, dwFlags);
			router.desktop.mouseEvent(code, x, y, dwFlags);
		}
	}
}