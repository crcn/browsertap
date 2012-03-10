var dirmr  = require('dirmr'),
_          = require('underscore'),
path       = require('path');

module.exports = function(platformDir, platforms) {

	var findTargetDirs = function(dir) {

		var i, targetPlatform, dirParts, hasMatch, platform;

		for(i = 0, n = platforms.length; i < n; i++) {

			targetPlatform = platforms[i].split(':');
			dirParts       = path.basename(dir).split(/\s*\>\s*/g),
			hasMatch       = true;


			for(j = 0, jn = dirParts.length; j < jn; j++) {

				platform = dirParts[j];

				if(j == targetPlatform.length || !_.intersection(platform.split(' '), [targetPlatform[j], 'common']).length) {
					hasMatch = false;
					break;
				}
			}


			if(hasMatch) {
				return true;
			}
		}

		return false;
	}

	return dirmr().readdir(platformDir, findTargetDirs);

}

module.exports.mergeJSON = dirmr.mergeJSON;
module.exports.parseTemplate = dirmr.parseTemplate;