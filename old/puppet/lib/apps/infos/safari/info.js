module.exports = {
	"check": {
		"if": { "name": "safari" },
		"thenRun": [
			{
				"set": {
					"cache.directory": ["C:/Users/Administrator/AppData/Local/Apple Computer","C:/Users/Administrator/AppData/Roaming/Apple Computer"],
					"process.names": ["safari*"],
					"process.cannotRunWith": ["safari"],
					"window.classes": [""],
					"window.allowMultiple": true,
					"window.searchMethod": "title",
					"type": "browser",
					"window.openNew": "%s",
					"window.getAppName": function(win) {
						return win.process.path.match(/(Safari\s[^\\]+)/)[1];
					},
					"padding.top": 83
				}
			}
		]
	}
}