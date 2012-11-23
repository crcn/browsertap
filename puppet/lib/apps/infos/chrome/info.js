module.exports = {
	"check": {
		"if": { "name": "chrome" },
		"thenRun": [
			{
				"set": {
					"cache.directory": "C:/Users/Administrator/AppData/Local/Google/Chrome/User Data",
					"process.names": ["chrome*"],
					"process.cannotRunWith": ["chrome"],
					// "process.run": [""]
					"window.classes": [""],
					"window.allowMultiple": true,
					"window.searchMethod": "title",
					"type": "browser",
					"window.openNew": "-new-window %s",
					"window.getAppName": function(win) {
						return win.process.name.split(".").shift();
					}
				}
			},
			{
				"check": {
					"if": { "version": {"$lte":19}},
					"thenRun": {
						"set": {
							"padding.top": 61
						}
					}
				}
			},
			{
				"check": {
					"if": { "version": {"$lt":5}},
					"thenRun": {
						"set": {
							"padding.top": 63
						}
					}
				}
			}
		]
	}
}