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
							"padding.top": 77
						}
					}
				}
			},
			{
				"check": {
					"if": { "version": {"$lte":7}},
					"thenRun": {
						"set": {
							"padding.top": 79
						}
					}
				}
			}
		]
	}
}