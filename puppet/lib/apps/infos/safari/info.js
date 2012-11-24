module.exports = {
	"check": {
		"if": { "name": "safari" },
		"thenRun": [
			{
				"set": {
					"cache.directory": "C:/Users/Administrator/AppData/Local/Apple Computer",
					"process.names": ["safari*"],
					"process.cannotRunWith": ["safari"],
					"window.classes": [""],
					"window.allowMultiple": true,
					"window.searchMethod": "title",
					"type": "browser",
					"window.openNew": "-new-window %s",
					"window.getAppName": function(win) {
						return win.process.path.match(/(Safari\s[^\\]+)/)[1];
					}
				}
			},
			{
				"check": {
					"if": { "version": {"$lte":6}},
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