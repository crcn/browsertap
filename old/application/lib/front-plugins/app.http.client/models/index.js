var lostPassword = require("./lostPassword");
exports.require = ["mongodb"];
exports.plugin = function(con) {
	return {
		LostPassword: lostPassword.plugin(con)
	};
}