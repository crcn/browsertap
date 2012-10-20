exports.plugin = function(router) {

	return {
		event: function(code, bScan, dwFlags) {
			console.log('keyboard event: %d, %d, %d', code, bScan, dwFlags);
			router.desktop.keyboardEvent(code, bScan, dwFlags);
		}
	}
}