
// for npm link
require('plugin').paths(__dirname + '/beans');

exports.plugin = function(router) {

	this.require(__dirname + '/plugins');
	
}