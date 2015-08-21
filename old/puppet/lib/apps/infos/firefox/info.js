module.exports = {
	"check": {
		"if": { "name": "firefox" },
		"thenRun": [
			{
				"set": {
					"cache.directory": ["C:/Users/Administrator/AppData/Local/Mozilla","C:/Users/Administrator/AppData/Roaming/Mozilla"],
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
							"padding.top": 110 //91 w/o bookmark
						}
					}
				}
			},
			{
				"check": {
					"if": { "version": {"$lte":3.6}},
					"thenRun": {
						"set": {
							"padding.top": 139,
							"padding.bottom":23 + 4
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