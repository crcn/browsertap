module.exports = {
	"check": {
		"if": { "name": "opera" },
		"thenRun": [
			{
				"set": {
					"cache.directory": "C:/Users/Administrator/AppData/Local/Opera",
					"process.names": ["opera*"],
					"process.cannotRunWith": ["opera"],
					"window.classes": [""],
					"window.allowMultiple": true,
					"window.searchMethod": "title",
					"type": "browser",
					"window.openNew": "-newWindow %s",
					"window.getAppName": function(win) {
						return win.process.path.match(/(Opera\s[^\\]+)/)[1];
					}
				}
			},
			{
				"check": {
					"if": { "version": {"$lte":13}},
					"thenRun": {
						"set": {
							"padding.top": 85,
							"padding.bottom": 22 + 4,
						}
					}
				}
			},
			{
				"check": {
					"if": { "version": {"$lte":10}},
					"thenRun": {
						"set": {
							"padding.top": 83
						}
					}
				}
			}
		]
	}
}