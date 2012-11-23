module.exports = {
	"check": {
		"if": { "name": "firefox" },
		"thenRun": [
			{
				"set": {
					"cache.directory": "C:/Users/Administrator/AppData/Local/Mozilla",
					"process.names": ["firefox*"],
					"process.cannotRunWith": ["firefox"],
					"window.classes": [""],
					"window.allowMultiple": true,
					"window.searchMethod": "title",
					"type": "browser",
					"window.openNew": "-new-window %s",
					"window.getAppName": function(win) {
						return win.process.path.match(/\\Mozilla\s+([^\\]+)/)[1];
					}
				}
			},
			{
				"check": {
					"if": { "version": {"$lte":12}},
					"thenRun": {
						"set": {
							"padding.top": 87
						}
					}
				}
			},
			{
				"check": {
					"if": { "version": {"$lt":3.6}},
					"thenRun": {
						"set": {
							"padding.top": 137
						}
					}
				}
			},
			{
				"check": {
					"if": { "version": {"$lt":3}},
					"thenRun": {
						"set": {
							"padding.top": 106
						}
					}
				}
			}
		]
	}
}